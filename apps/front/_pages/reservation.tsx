import type { FC } from 'react';
import type { FocusableElement } from '@chakra-ui/utils';
import type { AuthenticatedPageProps } from '^/components/AuthenticatedPage';
import { memo, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Center, Box, Divider, Button, Grid } from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import AuthenticatedPage from '^/components/AuthenticatedPage';
import useFetch from '^/hooks/useFetch';
import { useDispatchContext } from '^/store';
import { client, handleAuthError } from '^/utils/api';
import { getFormattedDate } from '^/utils/date';

const Reservation: FC<AuthenticatedPageProps> = memo(({ authHeader }: AuthenticatedPageProps) => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useDispatchContext();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const cancelRef = useRef<FocusableElement>(null);
  const reservation = useFetch(dispatch, undefined, client.account.reservations._reservationId(Number(id)), { headers: authHeader });
  const handleCancel = useCallback(async() => {
    onClose();
    await handleAuthError(dispatch, {}, client.account.reservations._reservationId(Number(id)).cancel.patch, { headers: authHeader });
    await reservation.revalidate();
  }, []);

  return reservation.data ? <Box m={4}>
    <Grid templateColumns="repeat(1, 1fr)" gap={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>チェックイン</Box>
        <Box>{getFormattedDate(reservation.data.checkin, 'yyyy/MM/dd HH:mm')}</Box>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>チェックアウト</Box>
        <Box>{getFormattedDate(reservation.data.checkout, 'yyyy/MM/dd HH:mm')}</Box>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>宿泊日数</Box>
        <Box>{reservation.data.nights}泊</Box>
      </Grid>
      <Divider/>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>お部屋</Box>
        <Box>{reservation.data.roomName}</Box>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>ご利用人数</Box>
        <Box>{reservation.data.number}名様</Box>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>宿泊者名</Box>
        <Box>{reservation.data.guestName}</Box>
      </Grid>
      <Divider/>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>宿泊料金</Box>
        <Box>¥{reservation.data.amount.toLocaleString()}</Box>
      </Grid>
    </Grid>
    <Center mt={6}>
      {reservation.data.status === 'cancelled' && <Button width={120} m={2} colorScheme="red" disabled>キャンセル済み</Button>}
      {reservation.data.status === 'checkout' && <Button width={120} m={2} colorScheme="teal" disabled>宿泊済み</Button>}
      {reservation.data.status === 'checkin' && <Button width={120} m={2} colorScheme="teal" disabled>チェックイン済み</Button>}
      {reservation.data.status === 'reserved' &&
      <Button width={120} m={2} colorScheme="red" onClick={onOpen}>キャンセル</Button>}
    </Center>
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            宿泊キャンセル
          </AlertDialogHeader>
          <AlertDialogBody>
            キャンセルしてもよろしいですか？
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button width={120} mx={1} colorScheme="red" onClick={handleCancel}>はい</Button>
            <Button width={120} mx={1} onClick={onClose}>いいえ</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </Box> : null;
});

Reservation.displayName = 'Reservation';
export default AuthenticatedPage(Reservation);
