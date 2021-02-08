import { defineController } from './$relay';
import { getGuestInfo } from '$/domains/front/reservation';

export default defineController(({ getGuestInfo }), ({ getGuestInfo }) => ({
  get: async({ user }) => getGuestInfo(user),
}));
