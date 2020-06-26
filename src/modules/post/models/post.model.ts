import {model, property, belongsTo} from '@loopback/repository';
import {BaseEntity} from '../../../models';
import {
  BlogCategory,
  BlogCategoryWithRelations,
} from '../../blog-category/models/blog-category.models';

@model({
  name: 'posts',
})
export class Post extends BaseEntity {
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

  @property({
    type: 'string',
    name: 'image_url',
  })
  imageURL: string;

  @property({
    type: 'string',
  })
  description: string;

  @belongsTo(
    () => BlogCategory,
    {keyFrom: 'blog_category_id', name: 'blog_category_id'},
    {
      name: 'blog_category_id',
      required: true,
    },
  )
  blogCategoryId: number;

  constructor(data?: Partial<Post>) {
    super(data);
  }
}

export interface PostRelations {
  // describe navigational properties here
  blogCategory: BlogCategoryWithRelations;
}

export type PostWithRelations = Post & PostRelations;
