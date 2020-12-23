import type { DailySales } from '$/domains/dashboard/types';

export type Methods = {
  get: {
    query?: {
      year?: number;
      month?: number;
    };
    resBody: DailySales[];
  }
}
