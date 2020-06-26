import {bind, BindingScope, Getter, inject} from '@loopback/core';
import {
  DataObject,
  repository,
  Count,
  Where,
  Filter,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';
import {PayloadToken} from '../auth/models/token-payload.dto';
import {PostRepository} from './repositories/post.repository';
import {BlogCategoryRepository} from '../blog-category/repositories/blog-category.repository';
import {Post} from './models/post.model';
import {BlogCategoryError, UserError} from '../../enums/error-key';
import {UploadFile} from '../../types';

@bind({scope: BindingScope.TRANSIENT})
export class PostService {
  constructor(
    @repository(BlogCategoryRepository)
    public blogCategoryRepository: BlogCategoryRepository,
    @repository(PostRepository)
    public postRepository: PostRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<PayloadToken | undefined>,
  ) {}

  async create(entity: DataObject<Post>, files: UploadFile[]): Promise<Post> {
    try {
      if (files.length > 0)
        entity.imageURL = files[0].location ? files[0].location : files[0].path;
      const blogCategory = await this.checkUserBelongsToBlogCategory(
        entity.blogCategoryId!,
      );

      if (blogCategory) {
        return await this.postRepository.create(entity);
      } else {
        throw new HttpErrors.UnprocessableEntity(
          BlogCategoryError.BlogCategoryDoesNotExist,
        );
      }
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(err);
    }
  }

  async count(where?: Where<Post>): Promise<Count> {
    return this.blogCategoryRepository.count(where);
  }

  async find(filter?: Filter<Post>): Promise<Post[]> {
    return this.postRepository.find(filter);
  }

  async updateAll(
    post: DataObject<Post>,
    files: UploadFile[],
    where?: Where<Post>,
  ): Promise<Count> {
    if (files.length > 0)
      post.imageURL = files[0].location ? files[0].location : files[0].path;
    return this.postRepository.updateAll(post, where);
  }

  async updateById(
    id: number,
    data: Partial<Post>,
    files: UploadFile[],
  ): Promise<void> {
    try {
      if (files.length > 0)
        data.imageURL = files[0].location ? files[0].location : files[0].path;
      const blogCategory = await this.checkUserBelongsToBlogCategory(
        data.blogCategoryId!,
      );

      if (blogCategory) {
        return await this.postRepository.updateById(id, data);
      } else {
        throw new HttpErrors.UnprocessableEntity(
          BlogCategoryError.BlogCategoryDoesNotExist,
        );
      }
    } catch (error) {
      throw new HttpErrors.UnprocessableEntity(error);
    }
  }

  async findById(id: number): Promise<Post> {
    return this.postRepository.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    return this.postRepository.deleteById(id);
  }

  private async checkUserBelongsToBlogCategory(
    blogCategoryId: number,
  ): Promise<boolean> {
    const blogCategory = await this.blogCategoryRepository.findOne({
      where: {
        id: blogCategoryId,
        userId: await this.getUserId(),
      },
    });
    return !!blogCategory;
  }

  private async getUserId(): Promise<number> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new HttpErrors.UnprocessableEntity(UserError.UserIdDoesNotExist);
    }
    return user.userId;
  }
}
