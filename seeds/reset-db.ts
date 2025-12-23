import { AppDataSource } from '../src/config/data-source';

async function resetDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('🔄 Resetting database...');

    // Drop tables in correct order
    await AppDataSource.query('DROP TABLE IF EXISTS refresh_tokens CASCADE;');
    await AppDataSource.query('DROP TABLE IF EXISTS users CASCADE;');
    await AppDataSource.query('DROP TABLE IF EXISTS roles CASCADE;');
    await AppDataSource.query('DROP TABLE IF EXISTS migrations CASCADE;');

    console.log('✅ Database reset complete');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();