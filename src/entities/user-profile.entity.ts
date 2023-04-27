import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class UserProfileEntity extends CustomBaseEntity {
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToOne(() => UserEntity, (user) => user.userProfile)
  @JoinColumn()
  user: UserEntity;
}
