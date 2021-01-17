import type { FC } from 'react';
import type { EventRefined } from '@fullcalendar/react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { Dispatch } from '~/store';
import { useMemo, useCallback, useState, useRef } from 'react';
import { Dialog, Link, FormControl, FormHelperText } from '@material-ui/core';
import OriginalFullCalendar from '@fullcalendar/react';
import { format, setHours } from 'date-fns';
import FullCalendar from '~/components/FullCalendar';
import { getEventDates } from '~/utils/calendar';
import { useDispatchContext } from '~/store';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type Props = {
  props: EditComponentPropsWithError<Model>;
  requiredFields: Array<string>;
  fetchCallback: (dispatch: Dispatch, rowData: Model, info: {
    start: Date;
    end: Date;
  }) => Promise<Array<EventRefined>>;
  isValidDate: (date: Date, rowData: Model, eventDates: Array<string>) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInitialDate: (rowData: Model, value: any) => string | Date;
  resultHour: number;
  target: string;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  calendar: {
    margin: theme.spacing(3),
  },
}));

const Calendar: FC<Props> = ({
  props,
  requiredFields,
  fetchCallback,
  isValidDate,
  getInitialDate,
  resultHour,
  target,
}: Props) => {
  const classes = useStyles();
  const { dispatch } = useDispatchContext();
  const calendarRef = useRef<OriginalFullCalendar>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleOpen = useCallback(() => {
    setOpen(true);
    props.hideError();
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const isFilledData = useMemo(() => !requiredFields.some(field => !props.rowData[field]), [props.rowData]);
  const fetchEvents = useCallback((info, successCallback) => {
    fetchCallback(dispatch, props.rowData, info).then(data => {
      if (props.rowData['checkin']) {
        data.push({
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
  const handleDateClick = useCallback(args => {
    if (isLoading) {
      return;
    }
    if (!isFilledData) {
      return;
    }
    if (!isValidDate(args.date, props.rowData, getEventDates(calendarRef.current))) {
      return;
    }

    props.onChange(setHours(args.date, resultHour));
    setOpen(false);
  }, [isLoading, isFilledData, props.rowData]);
  const handleEventLoading = useCallback(flag => {
    setIsLoading(flag);
  }, []);

  const field = useMemo(() => {
    if (!isFilledData) {
      return null;
    }
    return <Link
      component="button"
      variant="body2"
      onClick={handleOpen}
      data-testid={`select-${target}-date-link`}
    >
      {props.value ? format(new Date(props.value), 'yyyy-MM-dd') : '選択'}
    </Link>;
  }, [isFilledData, props.value]);
  const calendar = useMemo(() => <Dialog open={open} onClose={handleClose}>
    <div className={classes.calendar} data-testid={`select-${target}-date-calendar`}>
      <FullCalendar
        events={fetchEvents}
        dateClick={handleDateClick}
        calendarRef={calendarRef}
        loading={handleEventLoading}
        initialDate={getInitialDate(props.rowData, props.value)}
        target={target}
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

export default Calendar;
