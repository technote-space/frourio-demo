import { IsNotEmpty, IsEmail, Length, Matches } from 'class-validator';

export class AccountBody {
  @IsNotEmpty({ message: '値を入力してください' })
  @IsEmail(undefined, { message: 'メールアドレスを入力してください' })
  email: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  name: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 100, { message: '1~100文字で入力してください' })
  @Matches(/^[ァ-ヴー・　\s]+$/, { // eslint-disable-line no-irregular-whitespace
    message: 'カタカナを入力してください',
  })
  nameKana: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Matches(/^[0-9]{3}-[0-9]{4}$|^[0-9]{3}-[0-9]{2}$|^[0-9]{3}$|^[0-9]{5}$|^[0-9]{7}$/, {
    message: '正しい郵便番号を入力してください',
  })
  zipCode: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Length(1, 255, { message: '1~255文字で入力してください' })
  address: string;

  @IsNotEmpty({ message: '値を入力してください' })
  @Matches(/^[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}$/, {
    message: '正しい電話番号を入力してください',
  })
  phone: string;
}
