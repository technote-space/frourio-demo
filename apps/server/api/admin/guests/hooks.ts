import { defineHooks } from './$relay';
import { verifyAdmin } from '$/packages/application/service/auth';

export default defineHooks(() => ({
  onRequest: async(request, reply) => {
    if (!await verifyAdmin(request, 'guests')) {
      reply.status(401).send();
    }
  },
}));
