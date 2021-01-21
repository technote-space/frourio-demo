import type { AuthorizationPayload } from '$/types';
import { defineHooks } from './$relay';
import { verifyAdmin } from '$/service/auth';
import { parseQuery } from '$/repositories/utils';

export type AdditionalRequest = {
  user: AuthorizationPayload;
}

export default defineHooks(() => ({
  onRequest: async(request, reply) => {
    if (!await verifyAdmin(request)) {
      reply.status(401).send({ tokenExpired: true });
    }
  },
  preHandler: (request, reply, done) => {
    if (request.query && typeof request.query === 'object') {
      if ('query' in request.query) {
        request.query['query'] = parseQuery(request.query['query']);
      }
      request.query = parseQuery(request.query);
    }

    done();
  },
}));
