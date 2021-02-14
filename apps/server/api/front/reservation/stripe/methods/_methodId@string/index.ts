import type { AuthHeader } from '@frourio-demo/types';

export type Methods = {
  put: {
    reqHeaders: AuthHeader;
  };
  delete: {
    reqHeaders: AuthHeader;
  };
}
