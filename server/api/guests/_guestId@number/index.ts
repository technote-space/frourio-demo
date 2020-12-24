import type { AuthHeader } from '$/types';
import type { GuestWithDetail, UpdateGuestData } from '$/repositories/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: GuestWithDetail;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: UpdateGuestData;
    resBody: GuestWithDetail;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: GuestWithDetail;
  }
}
