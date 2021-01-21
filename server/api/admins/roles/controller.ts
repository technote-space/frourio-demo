import { defineController } from './$relay';
import { listRoles } from '$/domains/admins';

export default defineController(({ listRoles }), ({ listRoles }) => ({
  get: async() => listRoles(),
}));
