import { defineController } from './$relay';
import { listRoles } from '$/domains/admin/admins';

export default defineController(({ listRoles }), ({ listRoles }) => ({
  get: async() => listRoles(),
}));
