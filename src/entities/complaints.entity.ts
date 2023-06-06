import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { CustomBaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { VideoEntity } from './video.entity';

@Entity()
export class ComplaintsEntity extends CustomBaseEntity {
  @Column()
  title!: string;

  @Column()
  complaint!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => VideoEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  videpo: VideoEntity;
}
