import {Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';

@model()
export class PayloadToken extends Entity implements IAuthUser {
  @property({
    type: 'string',
    required: true,
  })
  clientId: string;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  constructor(data?: Partial<PayloadToken>) {
    super(data);
  }
}
