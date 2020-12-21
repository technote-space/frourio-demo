import { defineController } from './$relay';
import type { get, update, remove } from '$/domains/rooms';

export default defineController(({ get, update, remove }), ({ get, update, remove }) => ({
  get: async({ params }) => get(params.roomId),
  patch: async({ params, body }) => update(params.roomId, body),
  delete: async({ params }) => remove(params.roomId),
}));
