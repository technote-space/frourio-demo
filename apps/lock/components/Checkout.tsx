import type { FC } from 'react';
import type { FocusableElement } from '@chakra-ui/utils';
import type { RoomWithValidReservation } from '$/packages/application/usecase/lock/rooms/find';
import { memo, useCallback, useState, useRef } from 'react';
import { Box, Button } from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useDispatchContext } from '#/store';
import { client } from '#/utils/api';
import { setNotice, setError } from '#/utils/actions';
import { format } from 'date-fns';

type Props = {
  room: Required<RoomWithValidReservation>;
  isSending: boolean;
  setIsSending: (flag: boolean) => void;
  revalidate: () => Promise<boolean>;
}

const Checkout: FC<Props> = memo(({ room, isSending, setIsSending, revalidate }: Props) => {
  const { dispatch } = useDispatchContext();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const cancelRef = useRef<FocusableElement>(null);
  const handleCheckout = useCallback(() => {
    setIsSending(true);
    client.rooms._roomId(room.id).patch().then(() => {
      setNotice(dispatch, 'チェックアウトが完了しました。', 'チェックアウト');
    }).catch(error => {
      setError(dispatch, error.message);
    }).finally(() => {
      revalidate().finally(() => {
        setIsSending(false);
        setIsOpen(false);
      });
    });
  }, []);

  return room.reservation.status === 'checkin' ? <>
    <Box p={5} m={5} shadow="md" borderWidth={1} background="teal">
      <Button onClick={onOpen} isDisabled={isSending}>チェックアウト</Button>
      <Box mt={3}>
        チェックアウト予定：{format(new Date(room.reservation.checkout), 'yyyy/MM/dd HH:mm')}
      </Box>
    </Box>
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            チェックアウト
          </AlertDialogHeader>
          <AlertDialogBody>
            チェックアウトしてもよろしいですか？
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button mx={1} colorScheme="red" onClick={handleCheckout}>はい</Button>
            <Button mx={1} onClick={onClose}>いいえ</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </> : null;
});

Checkout.displayName = 'Checkout';
export default Checkout;
