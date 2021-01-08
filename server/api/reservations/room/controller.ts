import { defineController } from './$relay';
import { getSelectedRoom } from '$/domains/reservations';

export default defineController(({ getSelectedRoom }), ({ getSelectedRoom }) => ({
  get: async({ query: { roomId } }) => getSelectedRoom(roomId),
}));
