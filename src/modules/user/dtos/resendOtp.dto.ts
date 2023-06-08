import { IsEmail, IsString } from 'class-validator';

export class ResendOtpDto {
  @IsString()
  @IsEmail()
  email: string;
}
