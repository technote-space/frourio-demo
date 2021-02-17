import type { AuthHeader } from '@frourio-demo/types';
import type { LoginBody } from '$/validators';

export type Methods = {
  post: {
    reqBody: LoginBody;
    resHeaders?: AuthHeader;
  }
}
