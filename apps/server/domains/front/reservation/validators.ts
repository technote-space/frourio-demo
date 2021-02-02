import { IsNotEmpty, IsPositive, IsDateString, IsInt, IsOptional, Length } from 'class-validator';
import { startWithUppercase } from '@frourio-demo/utils/string';
import {
  IsIdExists,
  IsWithinLimit,
  IsReservable,
  IsKatakana,
  IsZipCode,
  IsPhoneNumber,
  NotPastDateString,
} from '$/repositories/utils/validator';

export class CreateReservationBody {
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsOptional()
  @IsIdExists('guest', ['name', 'nameKana', 'zipCode', 'address', 'phone'], (field, body) => {
    const key = `guest${startWithUppercase(field)}`;
    return !!body[key];
  })
  guestId?: number;

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
  @IsIdExists('room')
  roomId: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsInt({ message: '整数値を指定してください' })
  @IsPositive({ message: '1以上を指定してください' })
  @IsWithinLimit('room', 'number')
  number: number;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsDateString(undefined, { message: '正しい日付を入力してください' })
  @NotPastDateString()
  checkin: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsDateString(undefined, { message: '正しい日付を入力してください' })
  @IsReservable(true)
  checkout: string;

  @IsOptional()
  updateInfo?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
