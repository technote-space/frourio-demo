import { defineController } from './$relay';
import { list, create } from '$/domains/admins';
import { processBody } from '$/domains/admins/utils';

export default defineController(({ list, create }), ({ list, create }) => ({
  get: async({ query }) => list(query),
  post: async({ body }) => create(await processBody(body)),
}));
