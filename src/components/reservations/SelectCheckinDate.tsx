import type { FC } from 'react';
import type { CheckinNotSelectableEvent } from '$/domains/reservations';
import type { EventRefined } from '@fullcalendar/react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo, useCallback, useState, useRef } from 'react';
import { Dialog, Link, FormControl, FormHelperText } from '@material-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, setHours } from 'date-fns';
import { client, handleAuthError } from '~/utils/api';
import { getEventDates } from '~/utils/calendar';
import { useDispatchContext } from '~/store';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

type Props = {
  authHeader: { authorization: string };
  props: EditComponentPropsWithError<Model>;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  calendar: {
    margin: theme.spacing(3),
  },
}));

const SelectCheckinDate: FC<Props> = ({ authHeader, props }: Props) => {
  const classes                   = useStyles();
  const { dispatch }              = useDispatchContext();
  const calendarRef               = useRef<FullCalendar>(null);
  const [open, setOpen]           = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen                = useCallback(() => {
    setOpen(true);
    props.hideError();
  }, []);
  const handleClose               = useCallback(() => {
    setOpen(false);
  }, []);
  const fetchEvents               = useCallback((info, successCallback) => {
    if (!props.rowData['roomId']) {
      successCallback([]);
      return;
    }

    handleAuthError(dispatch, [] as Array<CheckinNotSelectableEvent>, client.reservations.calendar.checkin.get, {
      headers: authHeader,
      query: {
        roomId: props.rowData['roomId'],
        start: info.start,
        end: info.end,
      },
    }).then(data => {
      if (props.rowData['checkin']) {
        (data as EventRefined[]).push({
          title: 'チェックイン',
          start: props.rowData['checkin'],
          end: props.rowData['checkin'],
          allDay: true,
          color: '#0ec',
          textColor: 'black',
        });
      }
      successCallback(data);
    });
  }, [props.rowData['roomId'], props.rowData['checkin']]);
  const handleDateClick           = useCallback(args => {
    if (isLoading) {
      return;
    }
    if (getEventDates(calendarRef.current).includes(format(args.date, 'yyyy-MM-dd'))) {
      return;
    }

    props.onChange(setHours(args.date, 15));
    setOpen(false);
  }, [isLoading]);
  const handleEventLoading        = useCallback(flag => {
    setIsLoading(flag);
  }, []);

  const field    = useMemo(() => {
    if (!props.rowData['roomId']) {
      return null;
    }
    return <Link
      component="button"
      variant="body2"
      onClick={handleOpen}
    >
      {props.value ? format(new Date(props.value), 'yyyy-MM-dd') : '選択'}
    </Link>;
  }, [props.rowData['roomId'], props.value]);
  const calendar = useMemo(() => <Dialog open={open} onClose={handleClose}>
    <div className={classes.calendar}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={fetchEvents}
        height="auto"
        dateClick={handleDateClick}
        ref={calendarRef}
        loading={handleEventLoading}
      />
    </div>
  </Dialog>, [classes, open, isLoading]);

  return <>
    <FormControl error={Boolean(props.error)}>
      {field}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
    {calendar}
  </>;
};

export default SelectCheckinDate;
