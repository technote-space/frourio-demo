import { defineHooks } from './$relay';
import { verifyAdmin } from '$/utils';

export default defineHooks(() => ({
  onRequest: (request, reply) =>
    verifyAdmin(request).catch((err) => reply.send(err)),
}));
