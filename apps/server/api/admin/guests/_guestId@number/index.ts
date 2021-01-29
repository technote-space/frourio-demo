import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/repositories/guest';
import type { GuestBody } from '$/domains/admin/guests/validators';

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