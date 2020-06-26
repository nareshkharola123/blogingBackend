import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '../../../repositories/default-soft-crud.repository.base';
import {
  UserCredentials,
  UserCredentialsRelations,
} from '../models/user-credentials.model';
import {PgdbDataSource} from '../../../datasources';

export class UserCredentialsRepository extends DefaultSoftCrudRepository<
  UserCredentials,
  typeof UserCredentials.prototype.id,
  UserCredentialsRelations
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(UserCredentials, dataSource);
  }
}
