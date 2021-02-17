import { defineHooks } from './$relay';
import { parseQuery, processMultipartFormDataBody } from '$/repositories/utils';

export default defineHooks(() => ({
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
