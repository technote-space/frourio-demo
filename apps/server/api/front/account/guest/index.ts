import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/repositories/guest';
import type { AccountBody } from '$/domains/front/account/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: AccountBody;
    resBody: Guest;
  }
}
