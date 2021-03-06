import type { FC } from 'react';
import type { FocusableElement } from '@chakra-ui/utils';
import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Center, Box, Divider, Button, Grid } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { isAxiosError } from '@frourio-demo/utils/api';
import useFetch from '^/hooks/useFetch';
import { useStoreContext, useDispatchContext } from '^/store';
import { client, handleAuthError } from '^/utils/api';
import { getFormattedDate } from '^/utils/date';

const Reservation: FC = memo(() => {
  const { code } = useParams<{ code: string }>();
  const history = useHistory();
  const { dispatch } = useDispatchContext();
  const { guest } = useStoreContext();
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const cancelRef = useRef<FocusableElement>(null);
  const reservation = useFetch(dispatch, undefined, client.reservations._code(code));
  const handleCancel = useCallback(async() => {
    onClose();
    await handleAuthError(dispatch, {}, client.reservations._code(code).cancel.patch);
    await reservation.revalidate();
  }, []);

  useEffect(() => {
    if (reservation.error && isAxiosError(reservation.error) && reservation.error.response?.data.message === 'No Reservation found') {
      history.push(`${process.env.BASE_PATH}/`);
    }
  }, [reservation.error]);

  return reservation.data ? <Box m={4}>
    <Grid templateColumns="repeat(1, 1fr)" gap={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={5}>
        <Box>予約番号</Box>
        <Box>{code}</Box>
      </Grid>
      <Divider/>
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
      {guest && <Button m={2} as={Link} to={`${process.env.BASE_PATH}/reservations`}>
        予約一覧
      </Button>}
      {reservation.data.status === 'cancelled' && <Button m={2} colorScheme="red" disabled>キャンセル済み</Button>}
      {reservation.data.status === 'checkout' && <Button m={2} disabled>宿泊済み</Button>}
      {reservation.data.status === 'checkin' && <Button m={2} disabled>チェックイン済み</Button>}
      {reservation.data.status === 'reserved' &&
      <Button m={2} colorScheme="red" onClick={onOpen}>キャンセル</Button>}
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
            <Button mx={1} colorScheme="red" onClick={handleCancel}>はい</Button>
            <Button mx={1} onClick={onClose}>いいえ</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  </Box> : null;
});

Reservation.displayName = 'Reservation';
export default Reservation;
