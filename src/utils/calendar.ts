import type { EventApi } from '@fullcalendar/react';
import { eachDayOfInterval, subDays, format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';

export const getEventDates = (calendar: FullCalendar | null): Array<string> =>
  [...new Set((calendar?.getApi().getEvents() ?? []).filter(
    (event): event is EventApi & { start: Date; end: Date; } => !!event.start && !!event.end,
  ).flatMap(event => eachDayOfInterval({
    start: event.start,
    end: subDays(event.end, 1),
  })).map(date => format(date, 'yyyy-MM-dd')))].sort();
