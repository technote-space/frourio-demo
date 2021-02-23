import { defineController } from './$relay';
import { container } from 'tsyringe';
import { FindRoomUseCase } from '$/packages/application/usecase/lock/rooms/find';
import { CheckoutUseCase } from '$/packages/application/usecase/lock/rooms/checkout';

export default defineController(() => ({
  get: async({ params }) => container.resolve(FindRoomUseCase).execute(params.roomId),
  patch: async({ params }) => container.resolve(CheckoutUseCase).execute(params.roomId),
}));
