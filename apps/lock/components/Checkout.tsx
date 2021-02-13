import type { FC } from 'react';
import type { RoomWithValidReservation } from '$/domains/lock/rooms';
import { memo, useCallback } from 'react';
import { format } from 'date-fns';
import { Box, Button, Center } from '@chakra-ui/react';
import { useDispatchContext } from '#/store';
import { client } from '#/utils/api';
import { setError } from '#/utils/actions';

type Props = {
  room: RoomWithValidReservation;
  isSending: boolean;
  setIsSending: (flag: boolean) => void;
  revalidate: () => Promise<boolean>;
}

const Checkout: FC<Props> = memo(({ room, isSending, setIsSending, revalidate }: Props) => {
  const { dispatch } = useDispatchContext();
  const handleClick = useCallback(() => {
    setIsSending(true);
    client.rooms._roomId(room.id).delete().catch(error => {
      setError(dispatch, error.message);
    }).finally(() => {
      revalidate().finally(() => {
        setIsSending(false);
      });
    });
  }, []);

  return room.reservation ? <Box p={5} m={5} shadow="md" borderWidth={1} background="teal">
    <Box>{room.reservation.guestName}様</Box>
    <Box>チェックアウト予定：{format(new Date(room.reservation.checkout), 'yyyy/MM/dd HH:mm')}</Box>
    <Center mt={4}>
      <Button onClick={handleClick} isDisabled={isSending}>チェックアウト</Button>
    </Center>
  </Box> : null;
});

Checkout.displayName = 'Checkout';
export default Checkout;
