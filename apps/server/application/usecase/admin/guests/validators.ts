import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { IsKatakana, IsZipCode, IsPhoneNumber } from '$/domain/database/service/validator';

export class GuestBody {
  @IsNotEmpty({ message: '値を入力してください' })
  @IsEmail(undefined, { message: 'メールアドレスを入力してください' })
  email: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  name: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  @IsKatakana()
  nameKana: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsZipCode()
  zipCode: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 255, { message: '1~255文字で入力してください' })
  address: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @IsPhoneNumber()
  phone: string;
}
