import {RequestHandler} from 'express-serve-static-core';

export type FileUploadHandler = RequestHandler;

export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: string;
  path?: string;
  location?: string;
}

export interface FileUploadDATA {
  files: UploadFile[];
  fields: object;
}
