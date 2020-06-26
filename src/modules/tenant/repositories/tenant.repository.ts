import {Getter, inject} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DefaultUserModifyCrudRepository} from '../../../repositories/default-user-modify-crud.repository.base';
import {Tenant} from '../models/tenant.model';
import {PgdbDataSource} from '../../../datasources';
import {AuthUser} from '../../auth';

export class TenantRepository extends DefaultUserModifyCrudRepository<
  Tenant,
  typeof Tenant.prototype.id
> {
  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<AuthUser | undefined>,
  ) {
    super(Tenant, dataSource, getCurrentUser);
  }
}
