import type { AuthHeader } from '$/types';
import type { DailySales } from '$/domains/dashboard/types';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      date?: Date;
      roomId?: number;
    };
    resBody: DailySales[];
  }
}
