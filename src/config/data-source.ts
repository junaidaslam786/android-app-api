import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
  database: process.env.DB_NAME || 'admin_panel',
  entities: [User, Role, RefreshToken],
  migrations: [__dirname + '/../../migrations/*.js'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
