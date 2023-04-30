import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVideoCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}
