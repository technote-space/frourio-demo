import { IsPositive, IsInt } from 'class-validator';
import { IsIdExists } from '$/packages/domain/database/service/validator';
import { ReservationRepository } from '$/packages/infra/database/reservation';

class ReservationStatusBody {
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsIdExists(new ReservationRepository())
  id: number;
}

export class CheckinBody extends ReservationStatusBody {
}

export class SendRoomKeyBody extends ReservationStatusBody {
}

export class CheckoutBody extends ReservationStatusBody {
}

export class CancelBody extends ReservationStatusBody {
}
