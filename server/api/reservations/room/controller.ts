import { defineController } from './$relay';
import { getSelectedRoom } from '$/domains/reservations';

export default defineController(() => ({
  get: async({ query: { roomId } }) => getSelectedRoom(roomId),
}));
