/* eslint-disable @typescript-eslint/no-explicit-any */
import type { responseInterface, ConfigInterface } from 'swr';
import useAspidaSWR from '@aspida/swr';
import { AspidaResponse } from 'aspida';
import { handleAuthError } from '~/utils/api';
import type { MaybeUndefined } from '~/types';

type Options<T extends (option: any) => Promise<any>> = Parameters<Parameters<T> extends [Parameters<T>[0]] ? (option: Parameters<T>[0] & ConfigInterface<ReturnType<T> extends Promise<infer S> ? S : never> & {
  enabled?: boolean;
}) => void : (option?: Parameters<T>[0] & ConfigInterface<ReturnType<T> extends Promise<infer S> ? S : never> & {
  enabled?: boolean;
}) => void>;
type Res<T extends (option: any) => Promise<any>> = responseInterface<ReturnType<T> extends Promise<infer S> ? S : never, any>;
type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

const useFetch = <API extends Record<string, any> & {
  get: (option?: any) => Promise<AspidaResponse<any, any, any>>;
  $get: (option?: any) => Promise<any>;
  $path: (option?: any) => string;
}, T extends PromiseType<ReturnType<API['$get']>> | undefined>(dispatch: ((value: { type: string; [key: string]: any }) => void), fallback: T, api: API, ...option: Options<API['$get']>): Res<API['$get']> | MaybeUndefined<T> | never => useAspidaSWR({
  $get: option => handleAuthError(dispatch, fallback, api.get, option),
  $path: api.$path,
} as API, ...option);

export default useFetch;
