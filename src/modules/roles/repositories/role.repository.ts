import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '../../../repositories/default-soft-crud.repository.base';
import {Role} from '../models/role.model';
import {PgdbDataSource} from '../../../datasources';

export class RoleRepository extends DefaultSoftCrudRepository<
  Role,
  typeof Role.prototype.id
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(Role, dataSource);
  }
}
