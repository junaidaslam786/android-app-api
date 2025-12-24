import { DataSource } from 'typeorm';
import { Role } from '../src/modules/roles/entities/role.entity';
import { User } from '../src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '../src/modules/roles/role.enum';

export async function seedPhase1Data(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  console.log('🌱 Starting Phase 1 seed...');

  // Create roles (check if they already exist)
  let adminRole = await roleRepository.findOne({ where: { name: RoleEnum.ADMIN } });
  if (!adminRole) {
    adminRole = await roleRepository.save({
      name: RoleEnum.ADMIN,
      description: 'Administrator with full access',
    });
    console.log('✅ Admin role created');
  } else {
    console.log('ℹ️  Admin role already exists, skipping');
  }

  let userRole = await roleRepository.findOne({ where: { name: RoleEnum.USER } });
  if (!userRole) {
    userRole = await roleRepository.save({
      name: RoleEnum.USER,
      description: 'Regular user with basic access',
    });
    console.log('✅ User role created');
  } else {
    console.log('ℹ️  User role already exists, skipping');
  }

  // Create admin user (check if it already exists)
  const adminEmail = 'admin@labverse.org';
  let adminUser = await userRepository.findOne({ where: { email: adminEmail } });
  if (!adminUser) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    await userRepository.save({
      email: adminEmail,
      password: adminPassword,
      fullName: 'System Administrator',
      role: adminRole,
      isActive: true,
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️  Admin user already exists, skipping');
  }

  // Create test user (check if it already exists)
  const testEmail = 'user@labverse.org';
  let testUser = await userRepository.findOne({ where: { email: testEmail } });
  if (!testUser) {
    const userPassword = await bcrypt.hash('user123', 10);
    await userRepository.save({
      email: testEmail,
      password: userPassword,
      fullName: 'Test User',
      role: userRole,
      isActive: true,
    });
    console.log('✅ Test user created');
  } else {
    console.log('ℹ️  Test user already exists, skipping');
  }

  console.log('🎉 Phase 1 seed completed!');
  console.log('');
  console.log('Default accounts:');
  console.log('Admin: admin@labverse.org / admin123');
  console.log('User: user@labverse.org / user123');
}

// Run seed if called directly
if (require.main === module) {
  import('../src/config/data-source').then(async (module) => {
    const AppDataSource = module.default;
    try {
      await AppDataSource.initialize();
      await seedPhase1Data(AppDataSource);
      await AppDataSource.destroy();
    } catch (error) {
      console.error('Seed failed:', error);
      process.exit(1);
    }
  });
}
