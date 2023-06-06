import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComplaintsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  complaint: string;

  @IsNotEmpty()
  @IsString()
  videoId: string;
}
