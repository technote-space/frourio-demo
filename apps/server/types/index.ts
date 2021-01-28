import type { HttpStatusOk } from 'aspida';
import type { AuthHeader } from '@frourio-demo/types';

export type AdminAuthorizationPayload = {
  id: number;
  roles: string[];
};

export type GuestAuthorizationPayload = {
  id: number;
};

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
}

export type BodyResponse<T> = (BasicResponse & {
  body: T
}) | {
  status: HttpStatusNg;
  body?: {
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } & Record<string, any>;
}
