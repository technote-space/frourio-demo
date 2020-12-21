import { defineController } from './$relay';
import type { get, update, remove } from '$/domains/reservations';

export default defineController(({ get, update, remove }), ({ get, update, remove }) => ({
  get: async({ params }) => get(params.reservationId),
  patch: async({ params, body }) => update(params.reservationId, body),
  delete: async({ params }) => remove(params.reservationId),
}));
