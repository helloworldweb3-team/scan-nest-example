export interface LogProcessor {
  process(parseLogs:ParseLog[]):Promise<void>;
  getTopic():Promise<string>;
}

export type ParseLog = {
  address: string;          // 日志来源合约地址
  blockHash: string;        // 所在区块哈希
  blockNumber: number;      // 所在区块号（Web3 自动转换为十进制）
  data: string;             // 未索引的日志数据（十六进制）
  logIndex: number;         // 日志在区块中的索引位置
  removed: boolean;         // 是否因链重组被移除
  topics: string[];         // 索引参数（最多4个32字节主题）
  transactionHash: string;  // 所属交易哈希
  transactionIndex: number; // 交易在区块中的索引位置
}