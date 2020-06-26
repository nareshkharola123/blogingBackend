import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';

import {AuthenticateErrorKeys} from '../error-keys';
import {RevokedTokenRepository} from '../repositories/revoked-token.repository';
import {PayloadToken} from '../models/token-payload.dto';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor(
    @repository(RevokedTokenRepository)
    public revokedTokenRepository: RevokedTokenRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    console.log(':Verfiry-Bearer:');

    return async (token) => {
      console.log(':Verfiry-Bearer: Val');
      if (token && (await this.revokedTokenRepository.get(token))) {
        throw new HttpErrors.Unauthorized(AuthenticateErrorKeys.TokenRevoked);
      }
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as PayloadToken;
      return user;
    };
  }
}
