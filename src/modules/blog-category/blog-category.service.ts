import {bind, BindingScope, Getter, inject} from '@loopback/core';
import {
  DataObject,
  Options,
  repository,
  Where,
  Filter,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {BlogCategory} from './models/blog-category.models';
import {BlogCategoryRepository} from './repositories/blog-category.repository';
import {Count} from '@loopback/repository/src/common-types';
import {AuthenticationBindings} from 'loopback4-authentication';
import {PayloadToken} from '../auth/models/token-payload.dto';

@bind({scope: BindingScope.TRANSIENT})
export class BlogCategoryService {
  constructor(
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<PayloadToken | undefined>,
  ) {}

  async create(
    entity: DataObject<BlogCategory>,
    options?: Options,
  ): Promise<BlogCategory> {
    try {
      const userId = await this.getUserId();
      entity.userId = userId;
      return await this.blogCategoryRepository.create(entity);
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(err);
    }
  }

  async count(where?: Where<BlogCategory>): Promise<Count> {
    return this.blogCategoryRepository.count(where);
  }

  async find(filter?: Filter<BlogCategory>): Promise<BlogCategory[]> {
    return this.blogCategoryRepository.find(filter);
  }

  async updateAll(
    blogCategory: BlogCategory,
    where?: Where<BlogCategory>,
  ): Promise<Count> {
    return this.blogCategoryRepository.updateAll(blogCategory, where);
  }

  async updateById(
    id: number,
    data: Partial<BlogCategory>,
    options?: Options,
  ): Promise<void> {
    try {
      const userId = await this.getUserId();
      data.userId = userId;
      await this.blogCategoryRepository.updateById(id, data, options);
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(error);
    }
  }

  async findById(id: number): Promise<BlogCategory> {
    return this.blogCategoryRepository.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    return this.blogCategoryRepository.deleteById(id);
  }

  private async getUserId(): Promise<number> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new HttpErrors.UnprocessableEntity(
        'User Id is missing in the request parameters',
      );
    }
    return user.userId;
  }
}
