/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HttpStatusOk } from 'aspida';
import type { AuthHeader } from '@frourio-demo/types';

export type HttpStatusNg =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 409
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505

export type HttpStatusRedirect =
  | 301
  | 302

export type HttpStatusNo = HttpStatusOk | HttpStatusRedirect | HttpStatusNg

export type BasicResponse = {
  status: HttpStatusNo;
};
export type LoginResponse = BasicResponse & {
  headers?: AuthHeader;
};
export type ErrorResponse = {
  status: HttpStatusNg;
  body?: {
    message: string;
  } & Record<string, any>;
};
export type HttpResponse<T> = BasicResponse & {
  body: T;
};

export interface IResponseRepository {
  success<T>(body: T): HttpResponse<T>;

  created<T>(body: T): HttpResponse<T>;

  accepted<T>(body: T): HttpResponse<T>;

  noContent(): BasicResponse;

  error(status: HttpStatusNg, message?: string, data?: Record<string, any>): ErrorResponse;

  badRequest(message?: string, data?: Record<string, any>): ErrorResponse;

  unauthorized(message?: string, data?: Record<string, any>): ErrorResponse;

  forbidden(message?: string, data?: Record<string, any>): ErrorResponse;

  notFound(message?: string, data?: Record<string, any>): ErrorResponse;

  login(authorization: string): LoginResponse;
}
