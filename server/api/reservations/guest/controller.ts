import { defineController } from './$relay';
import { getSelectedGuest } from '$/domains/reservations';

export default defineController(() => ({
  get: async({ query: { guestId } }) => getSelectedGuest(guestId),
}));
