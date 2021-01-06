import { defineController } from './$relay';
import { getSelectableRooms } from '$/domains/dashboard';

export default defineController(() => ({
  get: async() => getSelectableRooms(),
}));
