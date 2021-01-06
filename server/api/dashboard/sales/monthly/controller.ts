import { defineController } from './$relay';
import { getMonthlySales } from '$/domains/dashboard';

export default defineController(({ getMonthlySales }), ({ getMonthlySales }) => ({
  get: async({ query }) => getMonthlySales(query?.date ?? new Date()),
}));
