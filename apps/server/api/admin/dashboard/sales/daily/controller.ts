import { defineController } from './$relay';
import { getDailySales } from '$/domains/admin/dashboard';

export default defineController(({ getDailySales }), ({ getDailySales }) => ({
  get: async({ query }) => getDailySales(query?.date ?? new Date(), query?.roomId),
}));
