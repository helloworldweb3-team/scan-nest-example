import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//@ts-ignore
BigInt.prototype.toJSON = function () {
  return Number.parseInt(this.toString());
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: getLogLevels(process.env.LOG_LEVEL || 'debug'),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,         // 自动类型转换
      exceptionFactory:(e)=>{
        throw e;
      }
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


function getLogLevels(level: string): LogLevel[] {
  const levels: Record<string, LogLevel[]> = {
    debug: [ 'debug','log', 'warn', 'error'],
    verbose: [ 'verbose','log', 'warn', 'error'],
    log: ['log', 'warn', 'error'],
    warn: ['warn', 'error'],
    error: ['error']
  };
  return levels[level] || levels['debug'];
}