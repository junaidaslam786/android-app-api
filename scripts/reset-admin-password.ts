import { DataSource } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

export async function resetAdminPassword(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  
  console.log('🔧 Resetting admin password...');
  
  const adminUser = await userRepository.findOne({ 
    where: { email: 'admin@labverse.org' } 
  });
  
  if (!adminUser) {
    console.log('❌ Admin user not found');
    return;
  }
  
  const newPassword = await bcrypt.hash('admin123', 10);
  
  await userRepository.update(
    { id: adminUser.id }, 
    { password: newPassword }
  );
  
  console.log('✅ Admin password reset successfully');
}

if (require.main === module) {
  import('../src/config/data-source').then(async ({ AppDataSource }) => {
    try {
      await AppDataSource.initialize();
      await resetAdminPassword(AppDataSource);
      await AppDataSource.destroy();
    } catch (error) {
      console.error('Password reset failed:', error);
      process.exit(1);
    }
  });
}