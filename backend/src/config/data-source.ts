import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST') || 'localhost',
  port: configService.get<number>('POSTGRES_PORT') || 5432,
  username: configService.get('POSTGRES_USER') || 'library_user',
  password: configService.get('POSTGRES_PASSWORD') || 'library_password',
  database: configService.get('POSTGRES_DB') || 'library_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development', // только для разработки!
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;