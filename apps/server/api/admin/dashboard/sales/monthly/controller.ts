import { defineController } from './$relay';
import { container } from 'tsyringe';
import { GetMonthlySalesUseCase } from '$/packages/application/usecase/admin/dashboard/getMonthlySales';

export default defineController(() => ({
  get: async({ query }) => container.resolve(GetMonthlySalesUseCase).execute(query?.date ?? new Date(), query?.roomId),
}));
