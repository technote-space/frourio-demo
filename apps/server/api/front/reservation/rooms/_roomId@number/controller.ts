import { defineController } from './$relay';
import { getRoomInfo } from '$/domains/front/reservation';

export default defineController(({ getRoomInfo }), ({ getRoomInfo }) => ({
  get: async({ params }) => getRoomInfo(params.roomId),
}));
