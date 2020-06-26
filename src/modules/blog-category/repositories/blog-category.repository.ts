import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {
  BlogCategory,
  BlogCategoryRelations,
} from '../models/blog-category.models';
import {User} from '../../user/models/user.model';
import {PgdbDataSource} from '../../../datasources';
import {UserRepository} from '../../user/repositories/user.repository';
import {DefaultSoftCrudRepository} from '../../../repositories/default-soft-crud.repository.base';

export class BlogCategoryRepository extends DefaultSoftCrudRepository<
  BlogCategory,
  typeof BlogCategory.prototype.id,
  BlogCategoryRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof BlogCategory.prototype.id
  >;

  constructor(
    @inject('datasources.pgdb') dataSource: PgdbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(BlogCategory, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user_id',
      userRepositoryGetter,
    );
  }
}
