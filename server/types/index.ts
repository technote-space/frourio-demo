import type { HttpStatusOk } from 'aspida';

export type AuthHeader = {
  authorization: string;
};

export type AuthorizationPayload = {
  id: number;
  roles: string[];
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

export const ReservationStatus = {
  reserved: '予約済み',
  cancelled: 'キャンセル',
  checkin: 'チェックイン',
  checkout: 'チェックアウト',
} as const;
export type ReservationStatus = keyof typeof ReservationStatus;
