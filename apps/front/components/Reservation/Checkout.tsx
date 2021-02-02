import type { FC } from 'react';
import type { ReservationData } from './index';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { Box, Link, Heading, GridItem } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, set, startOfToday } from 'date-fns';
import { getEventDates } from '@frourio-demo/utils/calendar';
import { useDispatchContext } from '^/store';
import { client, handleAuthError } from '^/utils/api';
import TimePicker from './TimePicker';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Props = {
  reservation: ReservationData;
  onChange: (checkout: Date, isChangeTime?: boolean) => void;
}

const getDateTime = (date: Date | string, time: string): Date => set(new Date(date), {
  hours: Number(time.split(':')[0]),
  minutes: Number(time.split(':')[1]),
  seconds: 0,
  milliseconds: 0,
});

const Checkout: FC<Props> = memo(({ reservation, onChange }: Props) => {
  const { dispatch } = useDispatchContext();
  const calendarRef = useRef<FullCalendar>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(reservation.checkout ? format(new Date(reservation.checkout), 'HH:mm') : '10:00');
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const fetchEvents = useCallback((info, successCallback) => {
    handleAuthError(dispatch, [], client.reservation.calendar.checkout.get, {
      query: {
        roomId: reservation.roomId!,
        checkin: new Date(reservation.checkin!),
        end: info.end,
      },
    }).then(data => {
      data.push({
        title: 'チェックイン',
        start: reservation.checkin,
        end: reservation.checkin,
        allDay: true,
        color: '#0ec',
        textColor: 'black',
      } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      successCallback(data);
    });
  }, [reservation]);
  const handleDateClick = args => {
    if (isLoading) {
      return;
    }

    const eventDates = getEventDates(calendarRef.current);
    if (!eventDates.includes(format(args.date, 'yyyy-MM-dd'))) {
      return;
    }

    onChange(getDateTime(args.date, time));
    handleClose();
  };
  const handleTimeChange = (time: string) => {
    const datetime = getDateTime(reservation.checkout!, time);
    setTime(time);
    onChange(datetime, true);
  };
  const handleEventLoading = useCallback(flag => {
    setIsLoading(flag);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, 500);
  }, [open]);

  return <>
    {reservation.checkin && <GridItem>
      <Box m={1} p={2} borderWidth={1} height="100%">
        <Link onClick={handleOpen}>
          <Heading as="h4" size="md">チェックアウト</Heading>
          {reservation.checkout && <Box>
            {format(new Date(reservation.checkout), 'yyyy/MM/dd')}
          </Box>}
        </Link>
        {reservation.checkout && <TimePicker
          value={time}
          step={30}
          minHour={6}
          maxHour={10}
          onChange={handleTimeChange}
        />}
      </Box>
    </GridItem>}
    <Modal isOpen={open} onClose={handleClose} size="4xl">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>チェックアウト日</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            events={fetchEvents}
            dateClick={handleDateClick}
            ref={calendarRef}
            loading={handleEventLoading}
            initialDate={reservation.checkin}
            validRange={{ start: startOfToday() }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  </>;
});

Checkout.displayName = 'Checkout';
export default Checkout;
