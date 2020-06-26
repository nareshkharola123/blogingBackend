import {
  post,
  requestBody,
  getWhereSchemaFor,
  param,
  get,
  getFilterSchemaFor,
  patch,
  del,
  RestBindings,
  Request,
  Response,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';

import {inject} from '@loopback/core';
import {Post} from './models/post.model';
import {PostService} from './post.service';
import {Where, Count, Filter, CountSchema} from '@loopback/repository';
import {FILE_UPLOAD_SERVICE} from '../../keys';
import {FileUploadHandler, FileUploadDATA} from '../../types';
import {getFilesAndFields} from '../../utils/file-upload';

const baseUrl = `/post`;

export class PostController {
  constructor(
    @inject('services.PostService')
    protected postService: PostService,
    @inject(FILE_UPLOAD_SERVICE) public handler: FileUploadHandler,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @post(baseUrl, {
    responses: {
      '200': {
        description: 'Post model instance',
        content: {'application/json': {schema: {'x-ts-type': Post}}},
      },
    },
  })
  async create(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Post> {
    const postData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await postData;
    return this.postService.create(result.fields, result.files);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get(`${baseUrl}/count`, {
    responses: {
      '200': {
        description: 'Post model count',
        content: {'application/json': {schema: Post}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Post))
    where?: Where<Post>,
  ): Promise<Count> {
    return this.postService.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get(baseUrl, {
    responses: {
      '200': {
        description: 'Array of Post model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Post}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Post))
    filter?: Filter<Post>,
  ): Promise<Post[]> {
    return this.postService.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch(baseUrl, {
    responses: {
      '200': {
        description: 'Post PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.where(Post) where?: Where<Post>,
  ): Promise<Count> {
    const blogData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await blogData;
    return this.postService.updateAll(result.fields, result.files, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @get(`${baseUrl}/{id}`, {
    responses: {
      '200': {
        description: 'Post model instance',
        content: {'application/json': {schema: {'x-ts-type': Post}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Post> {
    return this.postService.findById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @patch(`${baseUrl}/{id}`, {
    responses: {
      '204': {
        description: 'Post PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
              },
              imageURL: {
                type: 'string',
                format: 'binary',
              },
              description: {
                type: 'string',
              },
              blogCategoryId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<void> {
    const postData = new Promise<FileUploadDATA>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(getFilesAndFields(request));
        }
      });
    });
    const result = await postData;
    await this.postService.updateById(id, result.fields, result.files);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize(['*'])
  @del(`${baseUrl}/{id}`, {
    responses: {
      '204': {
        description: 'Post DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.postService.deleteById(id);
  }
}
