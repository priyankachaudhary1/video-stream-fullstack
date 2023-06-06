import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class UserProfileEntity extends CustomBaseEntity {
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToOne(() => UserEntity, (user) => user.userProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
