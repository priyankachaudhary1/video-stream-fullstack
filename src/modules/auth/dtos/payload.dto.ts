import { UserRoleEnum } from 'src/common/enum/user-role.enum';

export interface PayloadDto {
  id: string;
  email: string;
  role: UserRoleEnum;
}
