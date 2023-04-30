import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from './base.entity';

@Entity()
export class VideoCategoryEntity extends CustomBaseEntity {
  @Column()
  name!: string;
}
