import {HttpException} from '@nestjs/common';
import {RResult} from '../result/r.result';

export class BusinessException extends HttpException {
  r:RResult
  constructor(r:RResult) {
    super(r.message,200);
    this.r = r;
  }
}