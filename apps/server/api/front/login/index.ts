import type { AuthHeader } from '@frourio-demo/types';
import type { Auth0Body } from '$/validators';

export type Methods = {
  post: {
    reqBody: Auth0Body;
    resHeaders?: AuthHeader;
  }
}
