import { defineController } from './$relay';
import { getMonthlySales } from '$/domains/admin/dashboard';

export default defineController(({ getMonthlySales }), ({ getMonthlySales }) => ({
  get: async({ query }) => getMonthlySales(query?.date ?? new Date(), query?.roomId),
}));
