import { defineController } from './$relay';
import { validateKey } from '$/domains/lock/rooms';

export default defineController(({ validateKey }), ({ validateKey }) => ({
  post: async({ body }) => validateKey(body.roomId, body.key),
}));
