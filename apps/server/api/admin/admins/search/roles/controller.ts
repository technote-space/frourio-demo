import { defineController } from './$relay';
import { searchRole } from '$/domains/admin/admins';

export default defineController(({ searchRole }), ({ searchRole }) => ({
  get: async({ query }) => searchRole(query),
}));
