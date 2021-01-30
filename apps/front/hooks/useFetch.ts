import type { Dispatch, SwrApiOptions, SwrApiResponse, SwrApiType, SwrFallbackType } from '@frourio-demo/types';
import useAspidaSWR from '@aspida/swr';
import { handleAuthError } from '^/utils/api';
import type { MaybeUndefined } from '@frourio-demo/types';

const useFetch = <B, API extends SwrApiType<B>, F extends SwrFallbackType<API>>(dispatch: Dispatch, fallback: F, api: API, ...option: SwrApiOptions<API>): SwrApiResponse<API> | MaybeUndefined<F> | never => useAspidaSWR({
  $get: option => handleAuthError(dispatch, fallback, api.get, option),
  $path: api.$path,
} as API, ...option);

export default useFetch;
