import type { Guest, UpdateGuestData } from '$/repositories/guest';

export type Methods = {
  get: {
    resBody: Guest;
  };
  patch: {
    reqBody: UpdateGuestData;
    resBody: Guest;
  };
  delete: {
    resBody: Guest;
  }
}
