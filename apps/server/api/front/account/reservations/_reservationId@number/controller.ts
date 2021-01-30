import { defineController } from './$relay';
import { getReservationDetail } from '$/domains/front/account';

export default defineController(({ getReservationDetail }), ({ getReservationDetail }) => ({
  get: async({ user, params }) => getReservationDetail(user, params.reservationId),
}));
