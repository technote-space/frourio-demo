import type { FC } from 'react';
import { memo, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { startOfToday } from 'date-fns';
import { Box, Grid, Divider, Image, Heading } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { client, handleAuthError } from '^/utils/api';
import useFetch from '^/hooks/useFetch';
import { useDispatchContext } from '^/store';
import Reservation from '^/components/Reservation';
import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';

const Room: FC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { dispatch } = useDispatchContext();
  const fetchEvents = useCallback((info, successCallback) => {
    handleAuthError(dispatch, [], client.rooms._roomId(Number(id)).calendar.get, {
      query: {
        start: info.start,
        end: info.end,
      },
    }).then(data => {
      successCallback(data);
    });
  }, []);
  const room = useFetch(dispatch, undefined, client.rooms._roomId(Number(id)));

  useEffect(() => {
    if (room.error) {
      history.push(`${process.env.BASE_PATH}/rooms`);
    }
  }, [room.error]);

  return room.data ? <Box m={4}>
    <Heading m={2}>{room.data.name}</Heading>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/cover2.jpg`} />
    <Grid templateColumns="repeat(1, 1fr)" gap={4} m={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>ご利用可能最大人数</Box>
        <Box>{room.data.number}名様</Box>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>料金（1泊1人あたり）</Box>
        <Box>¥{room.data.price.toLocaleString()}</Box>
      </Grid>
    </Grid>
    <Divider />
    <Box m={6}>
      <Heading as="h4" size="md">空き状況</Heading>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={fetchEvents}
        initialDate={startOfToday()}
        validRange={{ start: startOfToday() }}
      />
    </Box>
    <Reservation roomId={Number(id)} />
  </Box> : null;
});

Room.displayName = 'Room';
export default Room;
