import { IsNotEmpty, IsPositive, IsDateString, IsInt, IsEmail, IsOptional, Length } from 'class-validator';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';
import { startWithUppercase } from '@frourio-demo/utils/string';
import {
  IsIdExists,
  IsWithinLimit,
  IsReservable,
  IsKatakana,
  IsZipCode,
  IsPhoneNumber,
  NotPastDateString,
} from '$/packages/domain/database/service/validator';
import { ReservationRepository } from '$/packages/infra/database/reservation';
import { GuestRepository } from '$/packages/infra/database/guest';
import { RoomRepository } from '$/packages/infra/database/room';

export class ValidateReservationBody {
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsOptional()
  @IsIdExists(new GuestRepository(), RESERVATION_GUEST_FIELDS, (field, body) => {
    const key = `guest${startWithUppercase(field)}`;
    return !!body[key];
  })
  guestId?: number;

  @IsOptional()
  @IsEmail(undefined, { message: 'メールアドレスを入力してください' })
  guestEmail?: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  guestName: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  @IsKatakana()
  guestNameKana: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsZipCode()
  guestZipCode: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 255, { message: '1~255文字で入力してください' })
  guestAddress: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsPhoneNumber()
  guestPhone: string;

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
  @NotPastDateString()
  checkin: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsDateString(undefined, { message: '正しい日付を入力してください' })
  @IsReservable(new ReservationRepository(), true)
  checkout: string;

  @IsOptional()
  updateInfo?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export class CreateReservationBody extends ValidateReservationBody {
  @IsNotEmpty({ message: '値を入力してください' })
  paymentMethodsId: string;
}
