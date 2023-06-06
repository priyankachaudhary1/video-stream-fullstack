import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAccountStatusDto {
  @IsNotEmpty()
  @IsNumber()
  otp!: number;
}
