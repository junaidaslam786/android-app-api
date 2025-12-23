import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToUsers1753400000000 implements MigrationInterface {
  name = 'AddIsActiveToUsers1753400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
  }
}