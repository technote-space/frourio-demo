import { eachDayOfInterval, subDays, format } from 'date-fns';

type EventApi = { start: Date; end: Date; }
type FullCalendar = { getApi: () => ({ getEvents: () => { start: Date | null, end: Date | null }[] | undefined }) }
export const getEventDates = (calendar: FullCalendar | null): Array<string> =>
  [...new Set((calendar?.getApi().getEvents() ?? []).filter(
    (event): event is EventApi => !!event.start && !!event.end,
  ).flatMap(event => eachDayOfInterval({
    start: event.start,
    end: subDays(event.end, 1),
  })).map(date => format(date, 'yyyy-MM-dd')))].sort();
