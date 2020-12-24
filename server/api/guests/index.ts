import type { AuthHeader } from '$/types';
import type { Guest, CreateGuestData, GuestOrderByInput } from '$/repositories/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      page?: number;
      orderBy?: GuestOrderByInput;
    };
    resBody: Guest[];
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateGuestData;
    resBody: Guest;
  }
}
