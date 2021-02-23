import type { AuthHeader } from '@frourio-demo/types';
import type { DailySales } from '$/packages/application/usecase/admin/dashboard/types';

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
