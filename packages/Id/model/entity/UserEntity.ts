import { BaseEntity } from '../base/BaseModels';

export interface UserEntity extends BaseEntity<number> {
  username?: string;
  realname?: string;
  mobile?: string;
  phoneNo?: string;
  email?: string;
  orgId?: string;
  userStatus?: string;
  password?: string;
  remark?: string;
}
