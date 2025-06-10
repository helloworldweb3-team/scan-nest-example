import {Inject, Injectable, Logger} from '@nestjs/common';
import {Interval} from '@nestjs/schedule';
import {EthLogScan} from '../eth-log/eth-log.scan';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

@Injectable()
export class ScanJob {

  constructor(
    @Inject()
    private readonly ethScan: EthLogScan,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
  }

  async handleCron() {
    this.logger.log('info',`Start scan eth log at:${new Date().toDateString()}`);
    try {
      await this.ethScan.startScan();
    } catch (e) {
      this.logger.error('Execute eth scan fail:', e);
    }
    this.logger.log('info',`End scan eth log at:${new Date().toDateString()}`);
  }
}