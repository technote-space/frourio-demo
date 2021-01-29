import { defineController } from './$relay';
import { getReservationDetail } from '$/domains/front/account';

export default defineController(() => ({
  get: async({ params }) => getReservationDetail(params.reservationId),
}));
