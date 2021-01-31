import { defineController } from './$relay';
import { reserve } from '$/domains/front/reservation';

export default defineController(({ reserve }), ({ reserve }) => ({
  post: async({ body, user }) => reserve(body, user),
}));
