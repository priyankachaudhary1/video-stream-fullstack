import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountStatusDto {
  @IsNotEmpty()
  @IsString()
  otp!: string;
}
