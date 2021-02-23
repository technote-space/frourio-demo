import { defineController } from './$relay';
import { container } from 'tsyringe';
import { CheckinUseCase } from '$/application/usecase/admin/dashboard/checkin';
import { GetCheckinUseCase } from '$/application/usecase/admin/dashboard/getCheckin';
import { SendRoomKeyUseCase } from '$/application/usecase/admin/dashboard/sendRoomKey';

export default defineController(() => ({
  get: async({ query }) => container.resolve(GetCheckinUseCase).execute(query.query, query.date),
  patch: async({ body }) => container.resolve(CheckinUseCase).execute(body.id),
  post: async({ body }) => container.resolve(SendRoomKeyUseCase).execute(body.id),
}));
