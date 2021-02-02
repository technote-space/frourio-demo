import type { FC, RefObject } from 'react';
import type { CalendarOptions } from '@fullcalendar/react';
import { memo } from 'react';
import OriginalFullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

type Props = CalendarOptions & {
  calendarRef: RefObject<OriginalFullCalendar>;
  target: string;
}

/* istanbul ignore next */
const FullCalendar: FC<Props> = memo((props: Props) => {
  /* istanbul ignore next */
  const { calendarRef, ...calendarOptions } = props;
  /* istanbul ignore next */
  return <OriginalFullCalendar
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    height="auto"
    {...calendarOptions}
    ref={calendarRef}
  />;
});

FullCalendar.displayName = 'FullCalendar';
export default FullCalendar;
