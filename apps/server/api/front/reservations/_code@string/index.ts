import type { ReservationDetail } from '$/packages/application/usecase/front/reservations/getReservationDetail';

export type Methods = {
  get: {
    resBody: ReservationDetail;
  };
}
