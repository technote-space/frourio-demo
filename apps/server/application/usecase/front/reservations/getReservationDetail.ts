import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import type { Reservation } from '$/domain/database/reservation';
import { singleton, inject } from 'tsyringe';
import { differenceInCalendarDays } from 'date-fns';

export type ReservationDetail = Reservation & {
  nights: number;
  room: {
    price: number
  };
}

@singleton()
export class GetReservationDetailUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(code: string) {
    const reservation = await this.repository.find(undefined, {
      include: {
        room: {
          select: {
            price: true,
          },
        },
      },
      where: { code },
    });
    const nights = differenceInCalendarDays(reservation.checkout, reservation.checkin);

    return this.response.success({
      ...reservation,
      nights,
    } as ReservationDetail);
  }
}
