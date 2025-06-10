import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject, Logger, UnauthorizedException} from '@nestjs/common';
import {QueryFailedError} from 'typeorm';
import {BusinessException} from '../exception/business.exception';
import {ResultStatus, RResult} from '../result/r.result';
import {Response} from 'express';
import {ValidationError} from 'class-validator';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter{
  constructor(
      @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let result:RResult;

    if (exception instanceof BusinessException) {
      result = exception.r;
    } else if (exception instanceof QueryFailedError) {
      // 处理TypeORM数据库错误
      result = new ResultStatus().DATABASE_ERROR
    } else if(exception instanceof UnauthorizedException){
      result = new ResultStatus().UNAUTHORIZED;
    } else if( Array.isArray(exception) && exception[0] instanceof ValidationError){
      const msg= this.formatValidationErrors(exception);
      result = new ResultStatus().INVALID_PARAMETER.setMessage(msg);
      console.trace(exception);
    }else if (exception instanceof Error) {
      result = new ResultStatus().FAIL
      this.logger.error({
        message: exception.toString(),
        context: {
          path: request.url,
          method: request.method,
          timestamp: new Date().toISOString(),
        },
      });
      this.logger.error(exception.stack);
    } else {
      result = new ResultStatus().FAIL
    }


    // 构造统一错误响应
    response.status(HttpStatus.OK).json(result);
  }


  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .flatMap(error =>
        Object.values(error.constraints || {})
      )
      .join(', ');
  }

}