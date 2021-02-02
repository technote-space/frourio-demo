import { defineController } from './$relay';
import { get } from '$/domains/front/guest';

export default defineController(({ get }), ({ get }) => ({
  get: async({ user }) => get(user),
}));
