import type { Dispatch, SwrApiOptions, SwrApiResponse, SwrApiType, SwrFallbackType } from '@frourio-demo/types';
import type { SWRResponse } from 'swr';
import useAspidaSWR from '@aspida/swr';
import { handleAuthError } from '^/utils/api';
import type { MaybeUndefined } from '@frourio-demo/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFetch = <B, API extends SwrApiType<B>, F extends SwrFallbackType<API>>(dispatch: Dispatch, fallback: F, api: API, ...option: SwrApiOptions<API>): SwrApiResponse<API> | SWRResponse<MaybeUndefined<F>, any> | never => useAspidaSWR({
  $get: option => handleAuthError(dispatch, fallback, api.get, option),
  $path: api.$path,
} as API, ...option);

export default useFetch;
