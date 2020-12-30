import { IsPositive, IsInt } from 'class-validator';
import { IsIdExists, IsWithinLimit, IsReservable } from '$/utils/prisma/validator';

export class ReservationStatusBody {
  @IsInt()
  @IsPositive()
  @IsIdExists('reservation')
  id: number;
}
