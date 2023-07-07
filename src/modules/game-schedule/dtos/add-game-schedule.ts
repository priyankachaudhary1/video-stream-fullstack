import { IsNotEmpty, IsString } from 'class-validator';

export class AddGameScheduleDto {
  @IsNotEmpty()
  @IsString()
  public scheduleDate!: string;

  @IsNotEmpty()
  @IsString()
  public categoryId!: string;
}
