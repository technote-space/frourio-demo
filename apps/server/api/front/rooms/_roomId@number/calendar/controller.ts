import { defineController } from './$relay';
import { container } from 'tsyringe';
import { CalendarUseCase } from '$/packages/application/usecase/front/rooms/calendar';

export default defineController(() => ({
  get: async({
    params,
    query: { start, end },
  }) => container.resolve(CalendarUseCase).execute(params.roomId, start, end),
}));
