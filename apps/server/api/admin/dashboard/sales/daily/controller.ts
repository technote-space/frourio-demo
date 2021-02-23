import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetDailySalesUseCase } from '$/application/usecase/admin/dashboard/getDailySales';

export default defineController(() => ({
  get: async({ query }) => container.resolve(GetDailySalesUseCase).execute(query?.date ?? new Date(), query?.roomId),
}));
