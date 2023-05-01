import { Column, Entity, OneToMany } from 'typeorm';
import { CustomBaseEntity } from './base.entity';
import { VideoEntity } from './video.entity';

@Entity()
export class VideoCategoryEntity extends CustomBaseEntity {
  @Column()
  name!: string;

  @OneToMany(() => VideoEntity, (video) => video.videoCategory, {
    onDelete: 'CASCADE',
  })
  video: VideoEntity;
}
