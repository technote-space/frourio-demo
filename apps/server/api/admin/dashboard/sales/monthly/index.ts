import type { AuthHeader } from '@frourio-demo/types';
import type { MonthlySales } from '$/application/usecase/admin/dashboard/types';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      date?: Date;
      roomId?: number;
    };
    resBody: MonthlySales[];
  }
}
