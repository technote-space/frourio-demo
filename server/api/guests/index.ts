import type { AuthHeader } from '$/types';
import type { GuestWithDetail, CreateGuestData, GuestOrderByInput } from '$/repositories/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      page?: number;
      orderBy?: GuestOrderByInput;
    };
    resBody: GuestWithDetail[];
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateGuestData;
    resBody: GuestWithDetail;
  }
}
