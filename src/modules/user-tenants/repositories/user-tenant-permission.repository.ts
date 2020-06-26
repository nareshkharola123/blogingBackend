import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {AuthenticationBindings} from 'loopback4-authentication';

import {UserTenantRepository} from './user-tenant.repository';
import {DefaultUserModifyCrudRepository} from '../../../repositories/default-user-modify-crud.repository.base';
import {
  UserTenantPermission,
  UserTenantPermissionRelations,
} from '../models/user-tenant-permission.model';
import {UserTenant} from '../models/user-tenant.model';
import {PgdbDataSource} from '../../../datasources';
import {AuthUser} from '../../auth';

export class UserTenantPermissionRepository extends DefaultUserModifyCrudRepository<
  UserTenantPermission,
  typeof UserTenantPermission.prototype.id,
  UserTenantPermissionRelations
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserTenantPermission.prototype.id
  >;
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter(UserTenantRepository)
    utRepositoryGetter: Getter<UserTenantRepository>,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<AuthUser | undefined>,
  ) {
    super(UserTenantPermission, dataSource, getCurrentUser);

    this.userTenant = this.createBelongsToAccessorFor(
      'user_tenant_id',
      utRepositoryGetter,
    );
  }
}
