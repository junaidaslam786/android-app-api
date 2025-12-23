import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPermissions1753360000038 implements MigrationInterface {
  name = 'CreateUserPermissions1753360000038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create permissions table first
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        resource VARCHAR(100) NOT NULL,
        action VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `);

    // Create indexes for permissions table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action)
    `);

    // Create role_permissions table (many-to-many relationship)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_id UUID NOT NULL,
        permission_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE(role_id, permission_id)
      )
    `);

    // Create indexes for role_permissions table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id)
    `);

    // Create composite index for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_role_permissions_role_permission ON role_permissions(role_id, permission_id)
    `);

    // Create user_permissions table (many-to-many relationship for direct user permissions)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_permissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        permission_id UUID NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        CONSTRAINT fk_user_permission_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_user_permission_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE(user_id, permission_id)
      )
    `);

    // Create indexes for user_permissions table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_permissions_permission_id ON user_permissions(permission_id)
    `);

    // Create composite index for better query performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_permissions_user_permission ON user_permissions(user_id, permission_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop user_permissions table first (due to foreign key constraints)
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_user_permissions_user_permission`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_user_permissions_permission_id`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_user_permissions_user_id`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS user_permissions`);

    // Drop role_permissions table
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_role_permissions_role_permission`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_role_permissions_permission_id`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_role_permissions_role_id`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS idx_permissions_resource_action`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_permissions_action`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_permissions_resource`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_permissions_name`);
    await queryRunner.query(`DROP TABLE IF EXISTS permissions`);
  }
}
