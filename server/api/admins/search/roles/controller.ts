import { defineController } from './$relay';
import { searchRole } from '$/domains/admins';

export default defineController(({ searchRole }), ({ searchRole }) => ({
  get: async({ query }) => searchRole(query),
}));
