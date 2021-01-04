import { defineController } from './$relay';
import { get } from '$/domains/admin';

export default defineController(({ get }), ({ get }) => ({
  get: async({ user }) => get(user),
}));
