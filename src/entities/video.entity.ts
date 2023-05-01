import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { VideoCategoryEntity } from './video-category.entity';

@Entity()
export class VideoEntity extends CustomBaseEntity {
  @Column()
  videoUrl!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @ManyToOne(
    () => VideoCategoryEntity,
    (videoCategory) => videoCategory.video,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  videoCategory: VideoCategoryEntity;
}
