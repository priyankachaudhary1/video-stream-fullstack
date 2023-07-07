import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { VideoCategoryEntity } from './video-category.entity';

@Entity()
export class GameScheduleEntity extends CustomBaseEntity {
  @Column()
  scheduleDate: string;

  @ManyToOne(() => VideoCategoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  category: VideoCategoryEntity;
}
