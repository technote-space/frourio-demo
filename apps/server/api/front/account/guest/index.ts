import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/repositories/guest';
import type { AccountBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: AccountBody;
    resBody: Guest;
  }
}
