import { defineController } from './$relay';
import { getCheckoutSelectable } from '$/domains/front/reservation';

export default defineController(({ getCheckoutSelectable }), ({ getCheckoutSelectable }) => ({
  get: async({ query: { roomId, end, checkin }, user }) => getCheckoutSelectable(roomId, end, checkin, user),
}));
