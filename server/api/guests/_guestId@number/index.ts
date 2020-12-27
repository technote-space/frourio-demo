import type { AuthHeader } from '$/types';
import type { Guest } from '$/repositories/guest';
import type { GuestBody } from '$/domains/guests/validators';

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
