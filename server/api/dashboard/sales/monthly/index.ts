import type { AuthHeader } from '$/types';
import type { MonthlySales } from '$/domains/dashboard/types';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      year?: number;
    };
    resBody: MonthlySales[];
  }
}
