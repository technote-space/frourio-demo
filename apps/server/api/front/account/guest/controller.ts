import { defineController } from './$relay';
import { getGuestInfo, updateGuestInfo } from '$/domains/front/account';

export default defineController(({ getGuestInfo, updateGuestInfo }), ({ getGuestInfo, updateGuestInfo }) => ({
  get: async({ user }) => getGuestInfo(user),
  patch: async({ user, body }) => updateGuestInfo(user, body),
}));
