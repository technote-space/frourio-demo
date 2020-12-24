import type { AuthHeader } from '$/types';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: string;
  }
}
