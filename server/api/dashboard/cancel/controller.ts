import { defineController } from './$relay';
import { cancel } from '$/domains/dashboard';

export default defineController(({ cancel }), ({ cancel }) => ({
  patch: async({ body }) => cancel(body.id),
}));
