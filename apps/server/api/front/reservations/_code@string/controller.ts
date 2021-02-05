import { defineController } from './$relay';
import { getReservationDetail } from '$/domains/front/reservations';

export default defineController(({ getReservationDetail }), ({ getReservationDetail }) => ({
  get: async({ params }) => getReservationDetail(params.code),
}));
