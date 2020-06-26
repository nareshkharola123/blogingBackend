import {BelongsToAccessor, repository} from '@loopback/repository';
import {Post, PostRelations} from '../models/post.model';
import {inject, Getter} from '@loopback/core';
import {PgdbDataSource} from '../../../datasources';
import {BlogCategoryRepository} from '../../blog-category/repositories/blog-category.repository';
import {BlogCategory} from '../../blog-category/models/blog-category.models';
import {DefaultSoftCrudRepository} from '../../../repositories/default-soft-crud.repository.base';

export class PostRepository extends DefaultSoftCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  public readonly blogCategory: BelongsToAccessor<
    BlogCategory,
    typeof BlogCategory.prototype.id
  >;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('BlogCategoryRepository')
    protected blogCategoryRepositoryGetter: Getter<BlogCategoryRepository>,
  ) {
    super(Post, dataSource);
    this.blogCategory = this.createBelongsToAccessorFor(
      'blog_category_id',
      blogCategoryRepositoryGetter,
    );

    this.registerInclusionResolver('user', this.blogCategory.inclusionResolver);
  }
}
