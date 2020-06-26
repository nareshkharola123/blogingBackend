import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from '../../../models';
import {User, UserWithRelations} from '../../user/models/user.model';
import {Tenant, TenantWithRelations} from '../../tenant/models/tenant.model';
import {Role, RoleWithRelations} from '../../roles/models/role.model';

@model({
  name: 'user_tenants',
})
export class UserTenant extends BaseEntity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @belongsTo(
    () => User,
    {keyFrom: 'user_id', name: 'user_id'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: number;

  @belongsTo(
    () => Tenant,
    {keyFrom: 'tenant_id', name: 'tenant_id'},
    {
      name: 'tenant_id',
      required: true,
    },
  )
  tenantId: number;

  @belongsTo(
    () => Role,
    {keyFrom: 'role_id', name: 'role_id'},
    {
      name: 'role_id',
      required: true,
    },
  )
  roleId: number;

  @property({
    type: 'string',
    required: true,
    default: 'active',
  })
  status: string;

  role: Role;
  tenant: Tenant;

  constructor(data?: Partial<UserTenant>) {
    super(data);
  }
}

export interface UserTenantRelations {
  user: UserWithRelations;
  tenant: TenantWithRelations;
  role: RoleWithRelations;
}

export type UserTenantWithRelations = UserTenant & UserTenantRelations;
