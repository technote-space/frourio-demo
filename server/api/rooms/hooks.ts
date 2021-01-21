import { defineHooks } from './$relay';
import { verifyAdmin } from '$/service/auth';

export default defineHooks(() => ({
  onRequest: async(request, reply) => {
    if (!await verifyAdmin(request, 'rooms')) {
      reply.status(401).send();
    }
  },
}));
