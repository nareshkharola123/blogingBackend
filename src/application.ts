import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import * as path from 'path';

import {
  BearerTokenVerifyProvider,
  ClientPasswordVerifyProvider,
  GoogleOauth2VerifyProvider,
  LocalPasswordVerifyProvider,
  ResourceOwnerVerifyProvider,
} from './modules/auth';
import {MySequence} from './sequence';
import multer from 'multer';
import {FILE_UPLOAD_SERVICE} from './keys';

export class TrendsTalksApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    // this.setUpBindings();
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    // set up directory Blog Image
    this.static('/images', path.join(__dirname, '../images'));

    // // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

    // Add authentication component
    this.component(AuthenticationComponent);
    // Customize authentication verify handlers
    this.bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER).toProvider(
      ClientPasswordVerifyProvider,
    );
    this.bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER).toProvider(
      LocalPasswordVerifyProvider,
    );
    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifyProvider,
    );
    this.bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER).toProvider(
      ResourceOwnerVerifyProvider,
    );
    this.bind(Strategies.Passport.GOOGLE_OAUTH2_VERIFIER).toProvider(
      GoogleOauth2VerifyProvider,
    );

    // Add authorization component
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers', 'modules'],
        extensions: ['.controller.js'],
        nested: true,
      },
      repositories: {
        dirs: ['repositories', 'modules'],
        extensions: ['.repository.js'],
        nested: true,
      },
      services: {
        dirs: ['services', 'modules'],
        extensions: ['.service.js'],
        nested: true,
      },
    };

    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: false,
    });
  }

  /**
   * Configure `multer` options for file upload
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected configureFileUpload(destination?: string) {
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'images');
        },
        filename: (req, file, cb) => {
          cb(null, new Date().toISOString() + '-' + file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
