import { defineController } from './$relay';
import { getDailySales } from '$/domains/dashboard';

export default defineController(({ getDailySales }), ({ getDailySales }) => ({
  get: async({ query }) => getDailySales(query?.year, query?.month),
}));
