import type { ReservationDetail } from '$/application/usecase/front/reservations/getReservationDetail';

export type Methods = {
  get: {
    resBody: ReservationDetail;
  };
}
