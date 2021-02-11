import type { HttpStatusOk } from 'aspida';
import type { Options } from 'nodemailer/lib/smtp-transport';
import type { Address } from 'nodemailer/lib/mailer';
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

export type MailOptions = Options;
export type MailAddress = string | Address | Array<string | Address>;
export type MailSettings = {
  from: string | Address;
  to: MailAddress;
  bcc?: MailAddress;
  subject: string;
  text: string;
  html: string;
}

export type QrInfo = {
  roomId: number;
  key: string;
  code: string;
}
