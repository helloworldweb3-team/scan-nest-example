import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {Web3} from 'web3';
import {LogProcessor, ParseLog} from './log-processor';
import {DataSource} from 'typeorm';
import {EthConfig} from '../config/eth.config';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import Redis from "ioredis";
import {PurchaseProcessor} from "./impl/purchase-processor";
import {sleep} from "openai/core";

@Injectable()
export class EthLogScan implements OnModuleInit {
  private readonly START_BLOCK_KEY:string = "startBlock";
  constructor(
    @Inject()
    private ethConfig: EthConfig,
    @Inject()
    private web3Eth: Web3,
    private datasource:DataSource,
    private purchaseProcessor:PurchaseProcessor,
    private redis:Redis,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logProcessor = [purchaseProcessor];
  }

  private lastScannedBlock: number = 0;
  private logProcessor: LogProcessor[] = [];
  private isScan = false;

  async onModuleInit(): Promise<void> {
    // 启动时恢复上次扫描位置
    this.lastScannedBlock = await this.loadLastScannedBlock();
    await this.startScan();
  }

  private async loadLastScannedBlock(): Promise<number> {
    this.logger.log('info','Load the last scanned Block');
    // 从数据库或Redis加载最后扫描的区块号
    const scanBlockStr = await this.redis.get("scan:startBlock");
    this.logger.log('info',`Load start block from db ,start block :${scanBlockStr}`)
    if (scanBlockStr == null) {
      const startBlock = this.ethConfig.startBlock;
      // store to db
      await this.redis.set("scan:startBlock",startBlock);
      return Number(startBlock);
    }else {
      return Number(scanBlockStr);
    }
  }

  private async saveLastScannedBlock(blockNumber: number): Promise<void> {

    await this.redis.set("scan:startBlock",blockNumber);
    this.logger.log('info',`Store last scanned Block ${blockNumber}`);
    this.lastScannedBlock = blockNumber;
  }

  /**
   *
   * @param blockNumber 要扫的终止块
   * @private
   */
  public async handleNewBlock(blockNumber: number) {
    if (this.isScan) {
      return;
    }
    this.isScan = true;
    try {
      let startBlock = this.lastScannedBlock;
      const maxStep=500;
      let endBlock = startBlock;
      while (endBlock < blockNumber){
        endBlock = maxStep + startBlock;

        if (endBlock>blockNumber) {
          endBlock = blockNumber;
        }
        this.logger.log('info',`扫描,开始:${startBlock},结束:${endBlock}`)
        await this.processBlock(startBlock, endBlock);
        this.lastScannedBlock = endBlock;
        await this.saveLastScannedBlock(endBlock);
        startBlock = endBlock;
      }
    } catch (error) {
      if (error instanceof Error){
        console.trace(error);
        this.logger.error(`区块扫描失败:`,error.stack);
      }else {
        this.logger.error(`区块扫描失败, Other`,error.message);
      }
    } finally {
      this.isScan = false;
    }
  }

  /**
   * @description 具体扫块的逻辑
   * @private
   * @param startBlock
   * @param endBlock
   */
  public async processBlock(startBlock: number, endBlock: number) {
    // 实现具体区块处理逻辑
    //@ts-ignore
    const ethLogs: ParseLog[] = await this.web3Eth.eth.getPastLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: this.ethConfig.scanAddress,
    });
    // this.logger.log(`Get ethLogs:${JSON.stringify(ethLogs)}`);
    let logProcessorTasks: Promise<void>[] = [];
    for (let logProcessor of this.logProcessor) {
      const topic= await logProcessor.getTopic();
      const logs = ethLogs.filter(d => d.topics[0] === topic);
      if (logs.length>0){
        logProcessorTasks.push(this.processBlockTry(logProcessor,logs));
      }
    }

    // 同时执行日志解析工作
    await Promise.all(logProcessorTasks);


  }
  public async processBlockTry(logProcessor:LogProcessor,logs:ParseLog[]){
    try {
      await logProcessor.process(logs);
    }catch (e){
      if (e instanceof Error) {
        this.logger.error(e.stack);
      }else {
        this.logger.error("Error to parse");
        console.trace(e)
      }
    }
  }


  private async getLatestBlockNumber(retries = 3): Promise<number> {
    for (let i = 0; i < retries; i++) {
      try {
        const blockNumBig= await this.web3Eth.eth.getBlockNumber();
        return Number(blockNumBig);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('无法获取最新区块高度');
  }

  public async startScan() {
    //与块保持距离，防止扫太快
    const currentBlock = await this.getLatestBlockNumber() - 5 ;
    if (currentBlock > this.lastScannedBlock) {
      await this.handleNewBlock(currentBlock);
    }
    await sleep(1000);

    await this.startScan();
  }
}

