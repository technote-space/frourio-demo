import type { FC } from 'react';
import type { EventRefined } from '@fullcalendar/react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { Dispatch } from '@frourio-demo/types';
import { useMemo, useCallback, useState, useRef } from 'react';
import { Dialog, Link, FormControl, FormHelperText } from '@material-ui/core';
import { TimePicker } from '@material-ui/pickers';
import OriginalFullCalendar from '@fullcalendar/react';
import { format, set } from 'date-fns';
import FullCalendar from '~/components/FullCalendar';
import { getEventDates } from '@frourio-demo/utils/calendar';
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

const getDateTime = (date: Date | string, time: Date | string): Date => set(new Date(date), {
  hours: (new Date(time)).getHours(),
  minutes: (new Date(time)).getMinutes(),
  seconds: 0,
  milliseconds: 0,
});

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
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(props.value ? getDateTime(props.value, props.value) : set(new Date(), {
    hours: resultHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  }));
  const handleOpenCalendar = useCallback(() => {
    setOpenCalendar(true);
    props.hideError();
  }, []);
  const handleCloseCalendar = useCallback(() => {
    setOpenCalendar(false);
  }, []);
  const handleOpenTimePicker = useCallback(() => {
    setOpenTimePicker(true);
  }, []);
  const handleCloseTimePicker = useCallback(() => {
    setOpenTimePicker(false);
  }, []);

  const getResultDate = (date: Date): Date => getDateTime(date, time);
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
    if (!isFilledData || isLoading) {
      return;
    }
    if (!isValidDate(args.date, props.rowData, getEventDates(calendarRef.current))) {
      return;
    }

    props.onChange(getResultDate(args.date));
    setOpenCalendar(false);
  }, [isLoading, isFilledData, props.rowData]);
  const handleTimeClick = useCallback((date: Date) => {
    const datetime = getDateTime(props.value, date);
    setTime(datetime);
    props.onChange(datetime);
    setOpenTimePicker(false);
  }, [props.value]);
  const handleEventLoading = useCallback(flag => {
    setIsLoading(flag);
  }, []);

  const TimePickerComponent: FC = () => {
    return <>
      <Link
        component="button"
        variant="body2"
        onClick={handleOpenTimePicker}
        data-testid={`select-${target}-time-link`}
      >
        {format(time, 'HH:mm')}
      </Link>
      <TimePicker
        open={openTimePicker}
        onClose={handleCloseTimePicker}
        value={time}
        ampm={false}
        autoOk
        onChange={handleTimeClick}
        minutesStep={5}
        TextFieldComponent={() => <></>}
      />
    </>;
  };

  const field = useMemo(() => {
    if (!isFilledData) {
      return null;
    }
    return <>
      <Link
        component="button"
        variant="body2"
        onClick={handleOpenCalendar}
        data-testid={`select-${target}-date-link`}
      >
        {props.value ? format(new Date(props.value), 'yyyy-MM-dd') : '選択'}
      </Link>
      {props.value && <TimePickerComponent/>}
    </>;
  }, [isFilledData, props.value, time, openTimePicker]);
  const calendar = useMemo(() => <Dialog open={openCalendar} onClose={handleCloseCalendar}>
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
  </Dialog>, [classes, openCalendar, isLoading]);

  return <>
    <FormControl error={Boolean(props.error)}>
      {field}
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
    {calendar}
  </>;
};

export default Calendar;
