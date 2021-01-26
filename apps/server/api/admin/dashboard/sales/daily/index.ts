import type { AuthHeader } from '@frourio-demo/types';
import type { DailySales } from '$/domains/admin/dashboard/types';

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
