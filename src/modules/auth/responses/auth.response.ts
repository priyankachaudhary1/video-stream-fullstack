import { UserRoleEnum } from 'src/common/enum/user-role.enum';

export class IAuthResponse {
  id!: string;
  accessToken: string;
  role: UserRoleEnum;
}
