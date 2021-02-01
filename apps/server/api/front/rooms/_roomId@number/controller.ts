import { defineController } from './$relay';
import { get } from '$/domains/front/rooms';

export default defineController(({ get }), ({ get }) => ({
  get: async({ params }) => get(params.roomId),
}));
