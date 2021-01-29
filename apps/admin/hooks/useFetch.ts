/* eslint-disable @typescript-eslint/no-explicit-any */
import type { responseInterface, ConfigInterface } from 'swr';
import type { Dispatch } from '@frourio-demo/types';
import useAspidaSWR from '@aspida/swr';
import { AspidaResponse } from 'aspida';
import { handleAuthError } from '~/utils/api';
import type { MaybeUndefined } from '@frourio-demo/types';

type Options<T extends (option: any) => Promise<any>> = Parameters<Parameters<T> extends [Parameters<T>[0]] ? (option: Parameters<T>[0] & ConfigInterface<ReturnType<T> extends Promise<infer S> ? S : never> & {
  enabled?: boolean;
}) => void : (option?: Parameters<T>[0] & ConfigInterface<ReturnType<T> extends Promise<infer S> ? S : never> & {
  enabled?: boolean;
}) => void>;
type Res<T extends (option: any) => Promise<any>> = responseInterface<ReturnType<T> extends Promise<infer S> ? S : never, any>;

export type ApiType<B> = Record<string, any> & {
  get: (option?: any) => Promise<AspidaResponse<B, any, any>>;
  $get: (option?: any) => Promise<B>;
  $path: (option?: any) => string;
};
export type ApiOptions<API extends ApiType<any>> = Options<API['$get']>;
export type ApiResponse<API extends ApiType<any>> = Res<API['$get']>;
export type FallbackType<API extends ApiType<any>> = API extends ApiType<infer B> ? B extends [] ? B | undefined : Partial<B> | undefined : never;

const useFetch = <B, F extends FallbackType<ApiType<B>>>(dispatch: Dispatch, fallback: F, api: ApiType<B>, ...option: ApiOptions<ApiType<B>>): ApiResponse<ApiType<B>> | MaybeUndefined<F> | never => useAspidaSWR({
  $get: option => handleAuthError(dispatch, fallback, api.get, option),
  $path: api.$path,
}, ...option);

export default useFetch;
