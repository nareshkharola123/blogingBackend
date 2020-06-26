import {
  post,
  get,
  requestBody,
  getModelSchemaRef,
  param,
  getWhereSchemaFor,
  getFilterSchemaFor,
  patch,
  del,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {BlogCategory} from './models/blog-category.models';
import {BlogCategoryService} from './blog-category.service';
import {inject} from '@loopback/core';
import {Where, Count, Filter, CountSchema} from '@loopback/repository';
import {PermissionKey} from '../auth/permission-key.enum';

const baseUrl = `/blog-category`;

export class BlogCategoryController {
  constructor(
    @inject('services.BlogCategoryService')
    protected blogCategoryService: BlogCategoryService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @post(baseUrl, {
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {'application/json': {schema: {'x-ts-type': BlogCategory}}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {
            title: 'title',
            exclude: ['id', 'createdOn', 'modifiedOn', 'deleted', 'userId'],
          }),
        },
      },
    })
    blogCategory: BlogCategory,
  ): Promise<BlogCategory> {
    return this.blogCategoryService.create(blogCategory);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get(`${baseUrl}/count`, {
    responses: {
      '200': {
        description: 'BlogCategory model count',
        content: {'application/json': {schema: BlogCategory}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(BlogCategory))
    where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryService.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get(baseUrl, {
    responses: {
      '200': {
        description: 'Array of BlogCategory model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': BlogCategory}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(BlogCategory))
    filter?: Filter<BlogCategory>,
  ): Promise<BlogCategory[]> {
    return this.blogCategoryService.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch(baseUrl, {
    responses: {
      '200': {
        description: 'BlogCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {
            title: 'title',
            exclude: ['id', 'createdOn', 'modifiedOn', 'deleted', 'userId'],
          }),
        },
      },
    })
    blogCategory: BlogCategory,
    @param.query.object('where', getWhereSchemaFor(BlogCategory))
    where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryService.updateAll(blogCategory, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get(`${baseUrl}/{id}`, {
    responses: {
      '200': {
        description: 'BlogCategory model instance',
        content: {'application/json': {schema: {'x-ts-type': BlogCategory}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<BlogCategory> {
    return this.blogCategoryService.findById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch(`${baseUrl}/{id}`, {
    responses: {
      '204': {
        description: 'BlogCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogCategory, {
            title: 'title',
            exclude: ['id', 'createdOn', 'modifiedOn', 'deleted', 'userId'],
          }),
        },
      },
    })
    blogCategory: BlogCategory,
  ): Promise<void> {
    await this.blogCategoryService.updateById(id, blogCategory);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize([PermissionKey.CreateTenant])
  @del(`${baseUrl}/{id}`, {
    responses: {
      '204': {
        description: 'BlogCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.blogCategoryService.deleteById(id);
  }
}
