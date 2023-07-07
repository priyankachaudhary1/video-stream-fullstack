import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity()
export class SignupOtpEntity extends CustomBaseEntity {
  @Column()
  otp!: string;

  @Column({ default: false })
  isAccepted!: boolean;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
