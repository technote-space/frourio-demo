import { differenceInCalendarDays } from 'date-fns';

export const getNights = (checkin: string | Date, checkout: string | Date): number => differenceInCalendarDays(new Date(checkout), new Date(checkin));

export const getPriceCalc = (price: number, number: number, checkin: string | Date, checkout: string | Date, amount: number): string => {
  const nights = getNights(checkin, checkout);
  if (nights <= 0) {
    return '';
  }

  const calculated = price * number * nights;
  return (amount === calculated ? '' : `¥${calculated} = `) + `¥${price} * ${number}人 * ${nights}泊`;
};
