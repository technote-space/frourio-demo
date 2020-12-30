import { IsPositive, IsInt, Min, IsOptional } from 'class-validator';
import { IsIdExists, IsWithinLimit, IsReservable } from '$/utils/prisma/validator';

class ReservationStatusBody {
  @IsInt()
  @IsPositive()
  @IsIdExists('reservation')
  id: number;
}

export class CheckinBody extends ReservationStatusBody {
}

export class CheckoutBody extends ReservationStatusBody {
  @IsInt()
  @Min(0)
  @IsOptional()
  payment?: number;
}

export class CancelBody extends ReservationStatusBody {
}
