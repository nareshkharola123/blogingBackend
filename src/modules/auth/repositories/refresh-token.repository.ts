import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RefreshToken} from '../models/refresh-token.model';
import {RedisDataSource} from '../../../datasources';

export class RefreshTokenRepository extends DefaultKeyValueRepository<
  RefreshToken
> {
  constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
    super(RefreshToken, dataSource);
  }
}
