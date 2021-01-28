import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/repositories/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  }
}
