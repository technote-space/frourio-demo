import type { FC } from 'react';
import { memo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { Flex, Box, Heading, Text } from '@chakra-ui/react';
import { useDispatchContext } from '#/store';
import useFetch from '#/hooks/useFetch';
import { client } from '#/utils/api';
import Reservation from '#/components/Reservation';
import Keypad from '#/components/Keypad';
import Checkout from '#/components/Checkout';

const Qr = dynamic(() => import('#/components/Qr'), {
  ssr: false,
});

const Room: FC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { dispatch } = useDispatchContext();
  const [isSending, setIsSending] = useState(false);
  const room = useFetch(dispatch, undefined, client.rooms._roomId(Number(id)));

  useEffect(() => {
    if (room.error) {
      history.push(`${process.env.BASE_PATH}/rooms`);
    }
  }, [room.error]);

  return room.data ? <Flex justifyContent="center" alignItems="center" direction="column" width="100%">
    <Heading mb={3}>{room.data.name}</Heading>
    {room.data.reservation && <Box background="teal" textAlign="center">
      <Reservation room={{
        ...room.data,
        reservation: room.data.reservation,
      }} />
      <Keypad roomId={room.data.id} isSending={isSending} setIsSending={setIsSending} revalidate={room.revalidate} />
      <Qr roomId={room.data.id} isSending={isSending} setIsSending={setIsSending} revalidate={room.revalidate} />
      <Checkout room={{
        ...room.data,
        reservation: room.data.reservation,
      }} isSending={isSending} setIsSending={setIsSending} revalidate={room.revalidate} />
    </Box>}
    {!room.data.reservation && <Text>
      予約はありません
    </Text>}
  </Flex> : null;
});

Room.displayName = 'Room';
export default Room;
