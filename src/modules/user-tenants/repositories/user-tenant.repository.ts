import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';

import {HttpErrors} from '@loopback/rest';
import {DefaultSoftCrudRepository} from '../../../repositories/default-soft-crud.repository.base';
import {UserTenant, UserTenantRelations} from '../models/user-tenant.model';
import {Tenant} from '../../tenant/models/tenant.model';
import {User} from '../../user/models/user.model';
import {Role} from '../../roles/models/role.model';
import {PgdbDataSource} from '../../../datasources';
import {TenantRepository} from '../../tenant/repositories/tenant.repository';
import {UserRepository} from '../../user/repositories/user.repository';
import {RoleRepository} from '../../roles/repositories/role.repository';

export class UserTenantRepository extends DefaultSoftCrudRepository<
  UserTenant,
  typeof UserTenant.prototype.id,
  UserTenantRelations
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof UserTenant.prototype.id
  >;

  public readonly user: BelongsToAccessor<User, typeof UserTenant.prototype.id>;
  public readonly role: BelongsToAccessor<Role, typeof UserTenant.prototype.id>;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter(TenantRepository)
    tenantRepositoryGetter: Getter<TenantRepository>,
    @repository.getter(UserRepository)
    userRepositoryGetter: Getter<UserRepository>,
    @repository.getter(RoleRepository)
    roleRepositoryGetter: Getter<RoleRepository>,
    @repository(RoleRepository)
    public roleRepo: RoleRepository,
  ) {
    super(UserTenant, dataSource);

    this.tenant = this.createBelongsToAccessorFor(
      'tenant_id',
      tenantRepositoryGetter,
    );

    this.user = this.createBelongsToAccessorFor(
      'user_id',
      userRepositoryGetter,
    );

    this.role = this.createBelongsToAccessorFor(
      'role_id',
      roleRepositoryGetter,
    );

    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }

  async create(user: User): Promise<UserTenant> {
    if (!user.id || !user.defaultTenant) {
      throw new HttpErrors.UnprocessableEntity(
        'User Id or Default Tenant Id is missing in the request parameters',
      );
    }
    const userTenant: UserTenant = new UserTenant();
    userTenant.userId = user.id;
    userTenant.tenantId = user.defaultTenant;
    const role = await this.roleRepo.findOne({
      where: {
        name: process.env.DEFAULT_ROLE,
      },
    });
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (role && role.id) {
      userTenant.roleId = role.id;
    } else {
      throw new HttpErrors.UnprocessableEntity('Failed to set default role.');
    }
    return super.create(userTenant);
  }
}
