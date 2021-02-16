import { IsPositive, IsInt } from 'class-validator';
import { IsIdExists } from '$/repositories/utils/validator';

class ReservationStatusBody {
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsIdExists('reservation')
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
