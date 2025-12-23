import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME,
  password: undefined,
  database: process.env.DB_NAME,
  entities: [User, Role, RefreshToken],
  migrations: ['migrations/*.ts'],
  synchronize: false,
  logging: true,
});
