import type { Guest, CreateGuestData, GuestOrderByInput } from '$/repositories/guest';

export type Methods = {
  get: {
    query?: {
      page?: number;
      orderBy?: GuestOrderByInput;
    };
    resBody: Guest[];
  };
  post: {
    reqBody: CreateGuestData;
    resBody: Guest;
  }
}
