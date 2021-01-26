/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch as _Dispatch } from 'react';
import type { AspidaResponse } from 'aspida';

export type MaybeUndefined<T> = undefined extends T ? undefined : never;

export type AuthHeader = {
  authorization: string;
};

export const ReservationStatus = {
  reserved: '予約済み',
  cancelled: 'キャンセル',
  checkin: 'チェックイン',
  checkout: 'チェックアウト',
} as const;
export type ReservationStatus = keyof typeof ReservationStatus;

export type RawLicenseType = {
  name: string;
  version: string;
  licenses: string | Array<string>;
  repository?: string;
  licenseText: string;
};
export type License = {
  name: string;
  version: string;
  licenses: string;
  repository?: string;
  licenseText: string;
};

export type Dispatch = _Dispatch<{ type: string, [key: string]: any; }>;

export type DataTableApi = {
  get: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  post: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  detail: (id: number) => {
    patch: (option?: any) => Promise<AspidaResponse<any, any, any>>;
    delete: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  }
};
