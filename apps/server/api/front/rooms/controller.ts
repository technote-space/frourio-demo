import { defineController } from './$relay';
import { list } from '$/domains/front/rooms';

export default defineController(({ list }), ({ list }) => ({
  get: async() => list(),
}));
