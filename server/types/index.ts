import type { HttpStatusOk } from 'aspida';

export type AuthHeader = {
  authorization: string;
};

export type AuthorizationPayload = {
  id: number;
  roles: string[];
};

export type HttpStatusNo =
  HttpStatusOk
  | 301
  | 302
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

export type BasicResponse = {
  status: HttpStatusNo;
};

export type LoginResponse = BasicResponse & {
  headers?: AuthHeader;
}

export type BodyResponse<T> = BasicResponse & {
  body: T
};

export type ContextState = {
  authToken?: string;
  name?: string;
  icon?: string;
  isSidebarOpen: boolean;
};
