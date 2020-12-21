import { depend } from 'velona';
import type { BodyResponse } from '$/types';
import type { Guest } from '$/repositories/guest';
import type { DailySales, MonthlySales } from '$/domains/dashboard/types';

export const getCheckinGuests = async(day?: Date): Promise<BodyResponse<Guest[]>> => ({
  status: 200,
  body: [],
});

export const getCheckoutGuests = async(day?: Date): Promise<BodyResponse<Guest[]>> => ({
  status: 200,
  body: [],
});

export const getMonthlySales = async(year?: number): Promise<BodyResponse<MonthlySales[]>> => ({
  status: 200,
  body: [],
});

export const getDailySales = async(year?: number, month?: number): Promise<BodyResponse<DailySales[]>> => ({
  status: 200,
  body: [],
});
