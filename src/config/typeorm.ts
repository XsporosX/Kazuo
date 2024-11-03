import { registerAs } from '@nestjs/config';
import { config as configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

configDotenv({ path: '.development.env' });

let config: DataSourceOptions = { type: 'postgres' };

if (process.env.NODE_ENV === 'production') {
  config = {
    type: 'postgres',
    url: process.env.DB_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    logging: false,
    synchronize: false, // cambiar a false en producción
  };
} else {
  config = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    logging: false,
    synchronize: true,
    dropSchema: true,
  };
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
