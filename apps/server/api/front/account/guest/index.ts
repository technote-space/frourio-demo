import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/domain/database/guest';
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
