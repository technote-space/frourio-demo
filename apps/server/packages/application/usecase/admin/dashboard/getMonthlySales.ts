import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { MonthlySales } from '$/packages/application/usecase/admin/dashboard/types';
import { singleton, inject } from 'tsyringe';
import { startOfYear, endOfYear, eachMonthOfInterval, format, parse } from 'date-fns';

@singleton()
export class GetMonthlySalesUseCase {
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
          gte: startOfYear(date),
          lt: endOfYear(date),
        },
        roomId,
      },
    });

    const months = eachMonthOfInterval({
      start: startOfYear(date),
      end: endOfYear(date),
    }).map(month => format(month, 'yyyy-MM'));

    const sales: Record<string, number> = Object.assign({}, ...months.map(month => ({ [month]: 0 })));
    reservations.forEach(reservation => {
      const key = format(reservation.checkin, 'yyyy-MM');
      sales[key] += reservation.payment ?? 0;
    });

    return this.response.success(Object.entries(sales).map(([month, sales]) => ({
      month: parse(month, 'yyyy-MM', new Date()),
      sales,
    })) as MonthlySales[]);
  }
}
