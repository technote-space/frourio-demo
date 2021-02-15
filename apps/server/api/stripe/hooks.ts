import type { GuestAuthorizationPayload } from '$/types';
import { defineHooks } from './$relay';
import { verifyGuest } from '$/service/auth';

export type AdditionalRequest = {
  user: GuestAuthorizationPayload;
}

export default defineHooks(() => ({
  onRequest: async(request) => {
    await verifyGuest(request);
  },
}));
