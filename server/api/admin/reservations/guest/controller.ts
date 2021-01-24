import { defineController } from './$relay';
import { getSelectedGuest } from '$/domains/admin/reservations';

export default defineController(({ getSelectedGuest }), ({ getSelectedGuest }) => ({
  get: async({ query: { guestId } }) => getSelectedGuest(guestId),
}));
