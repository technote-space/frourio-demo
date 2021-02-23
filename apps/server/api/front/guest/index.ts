import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/packages/domain/database/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Guest;
  }
}
