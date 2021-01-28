import type { AdminAuthorizationPayload } from '$/types';
import { defineHooks } from './$relay';
import { verifyAdmin } from '$/service/auth';
import { parseQuery, parseBody } from '$/repositories/utils';

export type AdditionalRequest = {
  user: AdminAuthorizationPayload;
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
    if (typeof request.body === 'object' && request.headers['content-type'] && /^multipart\/form-data/.test(request.headers['content-type'])) {
      request.body = parseBody(request.body as {});
    }

    done();
  },
}));
