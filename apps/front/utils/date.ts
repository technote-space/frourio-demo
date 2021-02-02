import { format } from 'date-fns';

const ensureDate = (date: Date | string): Date => typeof date === 'string' ? new Date(date) : date;
export const getFormattedDate = (date: Date | string, formatString: string): string => format(ensureDate(date), formatString);

export const WEEK = ['月', '火', '水', '木', '金', '土', '日'];
// https://date-fns.org/v2.16.1/docs/format
//   ISO day of week (formatting)
//   i:	1, 2, 3, ..., 7
export const getDayOfWeek = (date: Date | string): string => WEEK[Number(getFormattedDate(date, 'i')) - 1];
export const getWeekColor = (date: Date | string): string => {
  const week = getDayOfWeek(date);
  if (week === '土') {
    return 'cornflowerblue';
  }
  if (week === '日') {
    return 'tomato';
  }
  return 'dimgray';
};
export const getYear = (date: Date | string): string => getFormattedDate(date, 'yyyy');
export const getMonth = (date: Date | string): string => getFormattedDate(date, 'M');
export const getDate = (date: Date | string): string => getFormattedDate(date, 'dd');
