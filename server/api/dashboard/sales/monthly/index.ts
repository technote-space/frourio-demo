import type { MonthlySales } from '$/domains/dashboard/types';

export type Methods = {
  get: {
    query?: {
      year?: number;
    };
    resBody: MonthlySales[];
  }
}
