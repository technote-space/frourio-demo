import type { AuthHeader } from '@frourio-demo/types';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: string | undefined;
  }
}
