import { differenceInCalendarDays } from 'date-fns';

export const getPriceCalc = (price: number, number: number, checkin: string | Date, checkout: string | Date, amount: number): string => {
  const diff = differenceInCalendarDays(new Date(checkout), new Date(checkin));
  if (diff <= 0) {
    return '';
  }

  const calculated = price * number * diff;
  return (amount === calculated ? '' : `¥${calculated} = `) + `¥${price} * ${number}人 * ${diff}泊`;
};
