import { defineController } from './$relay';
import { list } from '$/domains/lock/rooms';

export default defineController(({ list }), ({ list }) => ({
  get: async() => list(),
}));
