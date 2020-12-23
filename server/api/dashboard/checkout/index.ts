import type { Guest } from '$/repositories/guest';

export type Methods = {
  get: {
    query?: {
      day?: Date;
    };
    resBody: Guest[];
  }
}
