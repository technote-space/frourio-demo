/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  IResponseRepository,
  BasicResponse,
  HttpResponse,
  HttpStatusNg,
  ErrorResponse,
  LoginResponse,
} from '$/packages/domain/http/response';

export class ResponseRepository implements IResponseRepository {
  success<T>(body: T): HttpResponse<T> {
    return {
      status: 200,
      body,
    };
  }

  created<T>(body: T): HttpResponse<T> {
    return {
      status: 201,
      body,
    };
  }

  accepted<T>(body: T): HttpResponse<T> {
    return {
      status: 202,
      body,
    };
  }

  noContent(): BasicResponse {
    return {
      status: 204,
    };
  }

  login(authorization: string): LoginResponse {
    return {
      status: 204,
      headers: { authorization },
    };
  }

  error(status: HttpStatusNg, message?: string, data?: Record<string, any>): ErrorResponse {
    return {
      ...data,
      status,
      ...(message ? { body: { message } } : {}),
    };
  }

  badRequest(message?: string, data?: Record<string, any>): ErrorResponse {
    return this.error(400, message, data);
  }

  unauthorized(message?: string, data?: Record<string, any>): ErrorResponse {
    return this.error(401, message, data);
  }

  forbidden(message?: string, data?: Record<string, any>): ErrorResponse {
    return this.error(403, message, data);
  }

  notFound(message?: string, data?: Record<string, any>): ErrorResponse {
    return this.error(404, message, data);
  }
}
