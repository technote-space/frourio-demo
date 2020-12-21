import { defineController } from './$relay';
import type { get, update, remove } from '$/domains/guests';

export default defineController(({ get, update, remove }), ({ get, update, remove }) => ({
  get: async({ params }) => get(params.guestId),
  patch: async({ params, body }) => update(params.guestId, body),
  delete: async({ params }) => remove(params.guestId),
}));
