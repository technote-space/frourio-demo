import type { AuthHeader } from '$/types';
import type { Guest } from '$/repositories/guest';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      day?: Date;
    };
    resBody: Guest[];
  }
}
