import { UserRoleEnum } from 'src/common/enum/user-role.enum';

export class IAuthResponse {
  accessToken: string;
  role: UserRoleEnum;
}
