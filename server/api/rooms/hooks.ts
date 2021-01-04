import { defineHooks } from './$relay';
import { verifyAdmin } from '$/utils';
import type { AuthorizationPayload } from '$/types';

export type AdditionalRequest = {
  user: AuthorizationPayload;
}

export default defineHooks(() => ({
  onRequest: (request, reply) =>
    verifyAdmin(request).catch((err) => reply.send(err)),
}));
