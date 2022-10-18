import { BaseEntity } from '../base/BaseModels';

export interface OrganizationEntity extends BaseEntity<number> {
  name: string;
  desc: string;
}
