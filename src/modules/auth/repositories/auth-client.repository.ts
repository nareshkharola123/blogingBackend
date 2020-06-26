import {inject} from '@loopback/core';
import {DefaultSoftCrudRepository} from '../../../repositories/default-soft-crud.repository.base';
import {PgdbDataSource} from '../../../datasources';
import {AuthClient} from '../models/auth-client.model';

export class AuthClientRepository extends DefaultSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(AuthClient, dataSource);
  }
}
