import {Module} from '@nestjs/common';
import {ScheduleModule} from '@nestjs/schedule';
import {JwtModule} from '@nestjs/jwt';
import {CustomConfigModule} from './config/config.module';
import {EthLogScan} from './eth-log/eth-log.scan';
import {ScanJob} from './job/scan.job';
import {redisProvider} from './other/redis.provider';
import {rpcProvider} from './other/rpc.provider';
import {DatabaseModule} from './database/database.module';
import {MemoryStoredFile, NestjsFormDataModule} from 'nestjs-form-data';
import {winstonConfig} from "./logger/winston.config";
import {WinstonModule} from "nest-winston";
import {PurchaseProcessor} from "./eth-log/impl/purchase-processor";


@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1days',

      },
    }),
    NestjsFormDataModule.config({ storage: MemoryStoredFile ,isGlobal:true}),
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [
  ],
  providers: [

    PurchaseProcessor,
    EthLogScan,


    ScanJob,
    ...redisProvider,
    ...rpcProvider,
  ],
})
export class AppModule {
}