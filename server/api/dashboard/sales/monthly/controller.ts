import { defineController } from './$relay';
import type { getMonthlySales } from '$/domains/dashboard';

export default defineController(({ getMonthlySales }), ({ getMonthlySales }) => ({
  get: async({ query }) => getMonthlySales(query?.year),
}));
