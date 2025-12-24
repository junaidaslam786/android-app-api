import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from '../modules/users/entities/user.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { RefreshToken } from '../modules/auth/entities/refresh-token.entity';

dotenv.config();

const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'admin_panel',
  entities: [User, Role, RefreshToken],
  migrations: [], // Migrations are run separately via CLI, not at runtime
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
  namingStrategy: new SnakeNamingStrategy(),
});

export default databaseConfig;
