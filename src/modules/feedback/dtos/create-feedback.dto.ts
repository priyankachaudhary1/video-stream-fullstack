import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  feedBack: string;

  @IsNotEmpty()
  @IsString()
  videoId: string;
}
