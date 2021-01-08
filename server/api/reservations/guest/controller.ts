import { defineController } from './$relay';
import { getSelectedGuest } from '$/domains/reservations';

export default defineController(({ getSelectedGuest }), ({ getSelectedGuest }) => ({
  get: async({ query: { guestId } }) => getSelectedGuest(guestId),
}));
