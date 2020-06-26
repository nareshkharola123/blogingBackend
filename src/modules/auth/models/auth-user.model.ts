import {model, property} from '@loopback/repository';
import {User} from '../../user/models/user.model';
import {Tenant} from '../../tenant/models/tenant.model';

@model()
export class AuthUser extends User {
  @property({
    type: 'array',
    itemType: 'string',
  })
  permissions: string[] = [];

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: Tenant,
    required: true,
  })
  tenant: Tenant;

  @property({
    type: 'string',
  })
  externalAuthToken?: string;

  @property({
    type: 'string',
  })
  externalRefreshToken?: string;

  constructor(data?: Partial<AuthUser>) {
    super(data);
  }
}
