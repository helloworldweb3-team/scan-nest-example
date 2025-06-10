import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import configuration from './configuration';
import {validate} from './configuration.validate';
import {EthConfig} from './eth.config';
import {RedisConfig} from './redis.config';
import {ServerConfig} from './server.config';
import {AdminConfig} from './admin.config';

export const configProvider = [
  {
    provide: EthConfig,
    useFactory: (configService: ConfigService) => {
      return configService.get<EthConfig>('eth')!;
    },
    inject: [ConfigService],
  },
  {
    provide: RedisConfig,
    useFactory: (configService: ConfigService) => {
      return configService.get<EthConfig>('redis')!;
    },
    inject: [ConfigService],
  },
  {
    provide: ServerConfig,
    useFactory: (configService: ConfigService) => {
      return configService.get<ServerConfig>('server')!;
    },
    inject: [ConfigService],
  },
  {
    provide: AdminConfig,
    useFactory: (configService: ConfigService) => {
      return configService.get<AdminConfig>('admin')!;
    },
    inject: [ConfigService],
  }
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.development.local',
        '.env.development',
        '.env.production',
        '.env',
      ],
      isGlobal: true,
      load: [configuration],
      validate,
    })],
  providers: [...configProvider],
  exports: [EthConfig,RedisConfig,ServerConfig,AdminConfig],
})
export class CustomConfigModule{
}
