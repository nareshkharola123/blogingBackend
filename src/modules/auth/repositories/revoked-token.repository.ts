import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RevokedToken} from '../models/revoked-token.model';
import {RedisDataSource} from '../../../datasources';

export class RevokedTokenRepository extends DefaultKeyValueRepository<
  RevokedToken
> {
  constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
    super(RevokedToken, dataSource);
  }
}
