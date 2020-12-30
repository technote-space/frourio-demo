import { defineController } from './$relay';
import { getMonthlySales } from '$/domains/dashboard';

export default defineController(({ getMonthlySales }), ({ getMonthlySales }) => ({
  get: async({ query }) => getMonthlySales(
    typeof query?.date === 'string' ? new Date(query.date) : query?.date ?? new Date(),
  ),
}));
