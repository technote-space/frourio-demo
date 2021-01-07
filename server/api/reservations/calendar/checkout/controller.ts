import { defineController } from './$relay';
import { getCheckoutSelectable } from '$/domains/reservations';

export default defineController(() => ({
  get: async({ query: { roomId, end, checkin } }) => getCheckoutSelectable(roomId, end, checkin),
}));
