import {ConfigService} from '@nestjs/config';
import {EthConfig} from '../config/eth.config';
import {Web3} from 'web3';

export const rpcProvider = [
  {
    provide: Web3,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<EthConfig>('eth')!.httpUrl;
      const wssUrl = configService.get<EthConfig>('eth')!.wsUrl;
      return new Web3(new Web3.providers.HttpProvider(url),);
    },
    inject: [ConfigService],
  },
];