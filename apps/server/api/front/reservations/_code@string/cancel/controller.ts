import { defineController } from './$relay';
import { cancel } from '$/domains/front/reservations';

export default defineController(({ cancel }), ({ cancel }) => ({
  patch: async({ params }) => cancel(params.code),
}));
