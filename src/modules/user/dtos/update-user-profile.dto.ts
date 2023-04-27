import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;
}
