import {ConfigService} from '@nestjs/config';
import Redis from 'ioredis';
import {RedisConfig} from '../config/redis.config';

export const redisProvider = [
  {
    provide: Redis,
    useFactory: (configService: ConfigService) => {
      const redisConfig = configService.get<RedisConfig>('redis')!;
      return new Redis(redisConfig.port, redisConfig.host, { password: redisConfig.password });
    },
    inject: [ConfigService],
  },
];