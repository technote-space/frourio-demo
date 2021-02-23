import type { IReservationRepository } from '$/domain/database/reservation';
import type { IResponseRepository } from '$/domain/http/response';
import type { DailySales } from '$/application/usecase/admin/dashboard/types';
import { singleton, inject } from 'tsyringe';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

@singleton()
export class GetDailySalesUseCase {
  public constructor(@inject('IReservationRepository') private repository: IReservationRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  public async execute(date: Date, roomId?: number) {
    const reservations = await this.repository.list({
      select: {
        payment: true,
        checkin: true,
      },
      where: {
        payment: {
          not: null,
        },
        checkin: {
          gte: startOfMonth(date),
          lt: endOfMonth(date),
        },
        roomId,
      },
    });

    const days = eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    }).map(day => format(day, 'yyyy-MM-dd'));

    const sales: Record<string, number> = Object.assign({}, ...days.map(day => ({ [day]: 0 })));
    reservations.forEach(reservation => {
      const key = format(reservation.checkin, 'yyyy-MM-dd');
      sales[key] += reservation.payment ?? 0;
    });

    return this.response.success(Object.entries(sales).map(([day, sales]) => ({
      day: parse(day, 'yyyy-MM-dd', new Date()),
      sales,
    })) as DailySales[]);
  }
}
