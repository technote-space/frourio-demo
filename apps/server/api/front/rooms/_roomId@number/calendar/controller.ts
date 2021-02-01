import { defineController } from './$relay';
import { calendar } from '$/domains/front/rooms';

export default defineController(({ calendar }), ({ calendar }) => ({
  get: async({ params, query: { start, end } }) => calendar(params.roomId, start, end),
}));
