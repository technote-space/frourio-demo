/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch as _Dispatch } from 'react';
import type { AspidaResponse } from 'aspida';
import type { SWRResponse, SWRConfiguration } from 'swr';
import { RESERVATION_STATUS } from '@frourio-demo/constants';

export type Primitive = string | number | undefined | null;

export type MaybeUndefined<T> = undefined extends T ? undefined : never;

export type AuthHeader = {
  authorization: string;
};

export type ReservationStatus = keyof typeof RESERVATION_STATUS;

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
  };
};

type Options<T extends (option: any) => Promise<any>> = Parameters<Parameters<T> extends [Parameters<T>[0]] ? (option: Parameters<T>[0] & SWRConfiguration<ReturnType<T> extends Promise<infer S> ? S : never> & {
  enabled?: boolean;
}) => void : (option?: Parameters<T>[0] & SWRConfiguration<ReturnType<T> extends Promise<infer S> ? S : never> & {
  enabled?: boolean;
}) => void>;
type Res<T extends (option: any) => Promise<any>> = SWRResponse<ReturnType<T> extends Promise<infer S> ? S : never, any>;
export type ApiType<B> = (option?: any) => Promise<AspidaResponse<B, any, any>>;
export type ApiOptions<API extends ApiType<any>> = Options<API>;
export type ApiResponse<API extends ApiType<any>> = API extends ApiType<infer B> ? B : never;
export type FallbackType<API extends ApiType<any>> = API extends ApiType<infer B> ? (B extends [] ? B : Partial<B>) | undefined : never;

export type SwrApiType<B> = Record<string, any> & {
  get: ApiType<B>;
  $get: (option?: any) => Promise<B>;
  $path: (option?: any) => string;
};
export type SwrApiOptions<API extends SwrApiType<any>> = Options<API['$get']>;
export type SwrApiResponse<API extends SwrApiType<any>> = Res<API['$get']>;
export type SwrFallbackType<API extends SwrApiType<any>> = FallbackType<API['get']>;
