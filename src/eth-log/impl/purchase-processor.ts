import {Inject, Injectable, Logger} from "@nestjs/common";
import {LogProcessor, ParseLog} from "../log-processor";
import {AbiParameter, Web3} from "web3";
import {DataSource} from "typeorm";
import Redis from "ioredis";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";
import * as evo from "../../abi/evo.json";
import {BigNumber} from "bignumber.js";
import {UserEntity} from "../../entity/user.entity";
import {UserEvoOrderEntity} from "../../entity/user-evo-order.entity";

@Injectable()
export class PurchaseProcessor implements LogProcessor {
    private readonly eventInputs: AbiParameter[];
    private topic0:string;
    constructor(
        @Inject()
        private web3: Web3,
        private dataSource: DataSource,
        private redis:Redis,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {
        const eventAbi = evo.abi.find(e => e.type === 'event' && e.name === 'Purchased');
        const eventSignature = 'Purchased(address,uint256,uint256,uint256)';
        const topic0 = web3.utils.keccak256(eventSignature);
        this.logger.log("info",`Purchased topic:${topic0}`)
        this.topic0 = topic0;
        this.eventInputs = eventAbi!.inputs;
    }

    getTopic(): Promise<string> {
        return Promise.resolve(this.topic0);
    }

    async process(parseLogs: ParseLog[]): Promise<void> {
        for (let parseLog of parseLogs) {
            parseLog.blockNumber;
            const blockInfo = await this.web3.eth.getBlock(parseLog.blockNumber);
            const result= await this.processOne(parseLog,blockInfo);
            try {
                await this.processToDb(result);
            }catch (e){
                this.logger.log('info',`Error to parse ${JSON.stringify(result)}`);
                this.logger.error(e.stack);
            }
        }

    }
    async processToDb(parseResult:AbiParseResult):Promise<void> {
        const userEntityRepository = this.dataSource.getRepository(UserEntity);
        const userEvoOrderEntityRepository = this.dataSource.getRepository(UserEvoOrderEntity);
        let user= await userEntityRepository.findOneBy({
            address: parseResult.user
        });
        if (!user){
            const userEntity = UserEntity.from({address:parseResult.user});
            user =await userEntityRepository.save(userEntity);
        }
        const ueo= await userEvoOrderEntityRepository.findOneBy({
            userId: user.id,
            hash: parseResult.transactionHash
        });
        if (ueo){
            this.logger.log("info","跳过处理");
            this.logger.log("info",`用户:${parseResult.user}订单已经存在.交易hash:${parseResult.transactionHash}`);
            return;
        }
        const userEvoOrderEntity= UserEvoOrderEntity.from({
            user,
            shareAmount:parseResult.shareAmount,
            usdtAmount: parseResult.usdtCost,
            evoAmount: parseResult.tokenAmount,
            hash:parseResult.transactionHash,
            timestamp:parseResult.timestamp
        });
        await userEvoOrderEntityRepository.save(userEvoOrderEntity);
        this.logger.log("info",`成功处用户:${parseResult.user}订单.交易hash:${parseResult.transactionHash}`);
    }

    async processOne(parseLog: ParseLog,blockInfo: any): Promise<AbiParseResult> {
        const dp= this.web3.eth.abi.decodeLog(
            this.eventInputs,
            parseLog.data,
            parseLog.topics,
        );
        parseLog.blockHash;
        parseLog.blockNumber;
        parseLog.transactionHash;
        parseLog.transactionIndex;


        return {
            user: String(dp.user),
            shareAmount: Number(dp.shareAmount),
            tokenAmount: new BigNumber(String(dp.tokenAmount)).div(10**18),
            usdtCost: new BigNumber(String(dp.usdtCost)).div(10**18),
            transactionHash: parseLog.transactionHash,
            timestamp: Number(blockInfo.timestamp) * 1000,
        }
    }
}

type AbiParseResult = {
    user: string,
    shareAmount: number,
    tokenAmount: BigNumber,
    usdtCost:BigNumber,
    transactionHash:string,
    timestamp: number
}