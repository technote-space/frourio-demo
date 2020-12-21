import { MinLength, IsEmail } from 'class-validator';

export class LoginBody {
  @IsEmail()
  email: string;

  @MinLength(4)
  pass: string;
}
