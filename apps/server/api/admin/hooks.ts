import type { AdminAuthorizationPayload } from '$/application/service/auth';
import { defineHooks } from './$relay';
import { verifyAdmin } from '$/application/service/auth';
import { parseQuery } from '$/application/service/table';
import { processMultipartFormDataBody } from '$/application/service/multipart';

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
      request.body = processMultipartFormDataBody(request.body as {});
    }

    done();
  },
}));
