import type { AuthHeader } from '$/types';
import type { LoginBody } from '$/validators';

export type Methods = {
  post: {
    reqBody: LoginBody;
    resHeaders?: AuthHeader;
  }
}
