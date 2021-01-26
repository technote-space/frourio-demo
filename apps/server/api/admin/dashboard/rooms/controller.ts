import { defineController } from './$relay';
import { getSelectableRooms } from '$/domains/admin/dashboard';

export default defineController(({ getSelectableRooms }), ({ getSelectableRooms }) => ({
  get: async() => getSelectableRooms(),
}));
