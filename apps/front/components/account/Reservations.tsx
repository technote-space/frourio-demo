import type { FC } from 'react';
import type { SwrApiType, SwrApiOptions } from '@frourio-demo/types';
import type { Reservation } from '$/repositories/reservation';
import { useMemo } from 'react';
import { Flex, Wrap, Box, Heading, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useFetch from '^/hooks/useFetch';
import { useDispatchContext } from '^/store';
import MiniCalendar from '^/components/MiniCalendar';

type API = SwrApiType<Reservation[]>;
type Props = {
  api: API;
  options: SwrApiOptions<API>;
}

const Reservations: FC<Props> = ({ api, options }: Props) => {
  const { dispatch } = useDispatchContext();
  const reservations = useFetch(dispatch, [], api, ...options);

  const ReservationItem: FC<{ reservation: Reservation }> = ({ reservation }) => <Box
    key={reservation.id}
    shadow="md"
    maxW="sm"
    borderWidth="1px"
    p="4"
    m="2"
  >
    <Heading as="h5" size="sm">{reservation.roomName}</Heading>
    <Box textAlign="center">
      <Flex>
        <Box m={2}>
          <Box fontSize="0.8rem">チェックイン</Box>
          <MiniCalendar date={reservation.checkin}/>
        </Box>
        <Box m={2}>
          <Box fontSize="0.8rem">チェックアウト</Box>
          <MiniCalendar date={reservation.checkout}/>
        </Box>
      </Flex>
      <Button as={Link} to={`/reservation/${reservation.id}`}>詳細を確認</Button>
    </Box>
  </Box>;

  return useMemo(() => reservations?.data ? <Wrap>
    {reservations.data.map(reservation => <ReservationItem key={reservation.id} reservation={reservation}/>)}
  </Wrap> : null, [reservations?.data]);
};

export default Reservations;
