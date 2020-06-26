import {Provider} from '@loopback/context';
import {repository} from '@loopback/repository';
import {VerifyFunction} from 'loopback4-authentication';

import {AuthUser} from '../models/auth-user.model';
import {UserRepository} from '../../user/repositories/user.repository';
import {Tenant} from '../../tenant/models/tenant.model';

export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  value(): VerifyFunction.LocalPasswordFn {
    console.log('::LocalPassword::');

    return async (username, password) => {
      console.log('::LocalPassword Value::');
      const user: AuthUser = new AuthUser(
        await this.userRepository.verifyPassword(username, password),
      );
      user.permissions = [];
      user.tenant = new Tenant({id: user.defaultTenant});
      return user;
    };
  }
}
