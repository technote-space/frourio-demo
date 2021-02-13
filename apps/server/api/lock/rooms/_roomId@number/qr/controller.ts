import { defineController } from './$relay';
import { validateQr } from '$/domains/lock/rooms';

export default defineController(({ validateQr }), ({ validateQr }) => ({
  post: async({ body }) => validateQr(body.roomId, body.data),
}));
