import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/packages/domain/database/guest';
import type { GuestBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: GuestBody;
    resBody: Guest;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  }
}
