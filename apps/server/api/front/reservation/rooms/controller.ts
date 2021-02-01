import { defineController } from './$relay';
import { getSelectRooms } from '$/domains/front/reservation';

export default defineController(({ getSelectRooms }), ({ getSelectRooms }) => ({
  get: async() => getSelectRooms(),
}));
