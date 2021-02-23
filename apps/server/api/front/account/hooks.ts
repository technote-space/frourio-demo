import type { GuestAuthorizationPayload } from '$/packages/application/service/auth';
import { defineHooks } from './$relay';
import { verifyGuest } from '$/packages/application/service/auth';

export type AdditionalRequest = {
  user: GuestAuthorizationPayload;
}

export default defineHooks(() => ({
  onRequest: async(request, reply) => {
    if (!await verifyGuest(request)) {
      reply.status(401).send({ tokenExpired: true });
    }
  },
}));
