import { defineController } from './$relay';
import { getCheckoutSelectable } from '$/domains/admin/reservations';

export default defineController(({ getCheckoutSelectable }), ({ getCheckoutSelectable }) => ({
  get: async({ query: { roomId, end, checkin, id } }) => getCheckoutSelectable(roomId, end, checkin, id),
}));
