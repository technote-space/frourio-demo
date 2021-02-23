import type { FC } from 'react';
import type { RoomWithValidReservation } from '$/packages/application/usecase/lock/rooms/find';
import { memo } from 'react';
import { format } from 'date-fns';
import { Box, Heading } from '@chakra-ui/react';

type Props = {
  room: Required<RoomWithValidReservation>;
}

const Reservation: FC<Props> = memo(({ room }: Props) => {
  return <Box p={5} m={5} shadow="md" borderWidth={1} background="teal">
    <Heading>{room.reservation.guestName}様</Heading>
    {room.reservation.status === 'reserved' && <Box>
      チェックイン予定：{format(new Date(room.reservation.checkin), 'yyyy/MM/dd HH:mm')}
    </Box>}
  </Box>;
});

Reservation.displayName = 'Reservation';
export default Reservation;
