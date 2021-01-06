import { defineHooks } from './$relay';
import { verifyAdmin } from '$/service/auth';
import type { AuthorizationPayload } from '$/types';

export type AdditionalRequest = {
  user: AuthorizationPayload;
}

export default defineHooks(() => ({
  onRequest: (request, reply) => verifyAdmin(request).catch(error => reply.send(error)),
}));
