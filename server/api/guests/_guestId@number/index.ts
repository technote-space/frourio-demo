import type { AuthHeader } from '$/types';
import type { Guest, UpdateGuestData } from '$/repositories/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: UpdateGuestData;
    resBody: Guest;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  }
}
