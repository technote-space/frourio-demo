import { IsNotEmpty, IsPositive, IsDateString, IsEnum, Min, IsInt, IsOptional } from 'class-validator';
import { IsIdExists, IsWithinLimit, IsReservable } from '$/domain/database/service/validator';
import { ReservationRepository } from '$/infra/database/reservation';
import { GuestRepository } from '$/infra/database/guest';
import { RoomRepository } from '$/infra/database/room';
import { RESERVATION_GUEST_FIELDS, RESERVATION_STATUS } from '@frourio-demo/constants';

export class ReservationBody {
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsOptional()
  @IsIdExists(new ReservationRepository())
  id?: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsOptional()
  @IsIdExists(new GuestRepository(), RESERVATION_GUEST_FIELDS)
  guestId?: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsIdExists(new RoomRepository())
  roomId: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsWithinLimit(new RoomRepository(), 'number')
  number: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsDateString(undefined, { message: '正しい日付を入力してください' })
  checkin: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsDateString(undefined, { message: '正しい日付を入力してください' })
  @IsReservable(new ReservationRepository())
  checkout: string;

  @IsOptional()
  @IsEnum(Object.keys(RESERVATION_STATUS), { message: '正しいステータスを指定してください' })
  status?: string;

  @IsOptional()
  @IsInt({ message: '整数値を指定してください' })
  @Min(0, { message: '0以上を指定してください' })
  payment?: number;
}
