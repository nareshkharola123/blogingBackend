import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from '../../../models';

import {User} from '../../user/models/user.model';

@model({
  name: 'blog_categories',
})
export class BlogCategory extends BaseEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
  })
  title: string;

  @belongsTo(
    () => User,
    {keyFrom: 'user_id', name: 'user_id'},
    {
      name: 'user_id',
      required: true,
    },
  )
  userId: number;

  constructor(data?: Partial<BlogCategory>) {
    super(data);
  }
}

export interface BlogCategoryRelations {
  // describe navigational properties here
}

export type BlogCategoryWithRelations = BlogCategory & BlogCategoryRelations;
