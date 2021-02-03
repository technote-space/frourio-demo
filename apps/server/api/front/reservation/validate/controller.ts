import { defineController } from './$relay';
import { validate } from '$/domains/front/reservation';

export default defineController(({ validate }), ({ validate }) => ({
  post: () => validate(),
}));
