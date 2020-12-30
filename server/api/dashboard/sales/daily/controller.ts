import { defineController } from './$relay';
import { getDailySales } from '$/domains/dashboard';

export default defineController(({ getDailySales }), ({ getDailySales }) => ({
  get: async({ query }) => getDailySales(
    typeof query?.date === 'string' ? new Date(query.date) : query?.date ?? new Date(),
  ),
}));
