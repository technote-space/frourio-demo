import { IsNotEmpty } from 'class-validator';

export class Auth0Body {
  @IsNotEmpty()
  accessToken: string;
}
