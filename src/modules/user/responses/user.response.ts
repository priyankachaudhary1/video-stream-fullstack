import { UserRoleEnum } from 'src/common/enum/user-role.enum';

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  isSuspended: boolean;
  profile?: string;
  address?: string;
  phoneNumber?: string;
}
