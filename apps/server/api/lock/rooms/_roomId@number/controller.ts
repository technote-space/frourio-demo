import { defineController } from './$relay';
import { get, checkout } from '$/domains/lock/rooms';

export default defineController(({ get, checkout }), ({ get, checkout }) => ({
  get: async({ params }) => get(params.roomId),
  delete: async({ params }) => checkout(params.roomId),
}));
