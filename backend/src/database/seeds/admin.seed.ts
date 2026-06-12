import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';
import { hashPassword } from '../../common/utils/hash.util';

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const usersRepository = dataSource.getRepository(User);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

  const existingAdmin = await usersRepository.findOne({
    where: {
      email: adminEmail,
    },
  });

  if (existingAdmin) {
    console.log('Адмін вже існує.');
    return;
  }

  const admin = usersRepository.create({
    email: adminEmail,
    password: await hashPassword('admin123'),
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  });

  await usersRepository.save(admin);

  console.log('Адміна успішно створено');
}
