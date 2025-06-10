import {DataSource} from 'typeorm';
import configuration from '../config/configuration';
import {SnakeToCamelNamingStrategy} from "./snake-to-camel-naming.strategy";

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const conf = configuration();
      const dataSource = new DataSource({
        type: 'mysql',
        host: conf.database.host,
        port: conf.database.port,
        username: conf.database.username,
        password: conf.database.password,
        database: conf.database.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        namingStrategy: new SnakeToCamelNamingStrategy(),
        synchronize: false, //是否需求建表改表
        timezone: 'UTC+8',
        // extra: {
        //   timezone: 'UTC+8', // 或 'UTC+8'
        // },
        // logger:"debug",
        logging: ["query", "error"]
        // logging: ["error"]
      });

      return dataSource.initialize();
    },
  },
];
