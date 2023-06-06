import { BeforeInsert, Column, Entity, Index, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CustomBaseEntity } from './base.entity';
import { UserProfileEntity } from './user-profile.entity';
import { UserRoleEnum } from 'src/common/enum/user-role.enum';

@Entity()
export class UserEntity extends CustomBaseEntity {
  @Column()
  name?: string;

  @Index()
  @Column()
  email!: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: UserRoleEnum })
  role!: UserRoleEnum;

  @Column({ type: 'boolean', default: false })
  isSuspended: boolean;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @OneToOne(() => UserProfileEntity, (userProfile) => userProfile.user)
  userProfile: UserProfileEntity;
}
