import { UserEntity } from 'src/entities/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, datasource: DataSource): Promise<void> {
    const admin = {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin',
      role: UserRoleEnum.ADMIN,
      isActive: true,
    };
    console.log('seed here');

    const adminUser = datasource.getRepository(UserEntity).create(admin);
    await datasource.getRepository(UserEntity).save(adminUser);
    console.log('====seeding admin====', adminUser);
  }
}
