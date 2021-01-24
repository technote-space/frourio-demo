import { MinLength, IsEmail } from 'class-validator';

export class LoginBody {
  @IsEmail(undefined, { message: '正しいメールアドレスを入力してください' })
  email: string;

  @MinLength(4, { message: 'パスワードが短すぎます' })
  pass: string;
}
