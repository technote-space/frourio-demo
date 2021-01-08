import { defineController } from './$relay';
import { getSelectableRooms } from '$/domains/dashboard';

export default defineController(({ getSelectableRooms }), ({ getSelectableRooms }) => ({
  get: async() => getSelectableRooms(),
}));
