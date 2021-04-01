import type { FC } from 'react';
import type { Room } from '$/packages/domain/database/room';
import type { ReservationData } from '^/components/Reservation/index';
import type { CreateReservationBody } from '$/packages/application/usecase/front/reservation/validators';
import { memo, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { Flex, Box, Center, Grid, GridItem, Divider, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { startWithUppercase } from '@frourio-demo/utils/string';
import useAuthToken from '^/hooks/useAuthToken';
import useUnmountRef from '@technote-space/use-unmount-ref';
import { client } from '^/utils/api';
import { setNotice, setError } from '^/utils/actions';
import { useDispatchContext, useStoreContext } from '^/store';
import { ACCOUNT_FIELDS, RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';

type Props = {
  hidden: boolean;
  reservation: ReservationData;
  room?: Room;
  nights: number;
  onCancel: () => void;
  onSubmit: () => void;
}

const Confirm: FC<Props> = memo(({ hidden, reservation, room, nights, onCancel, onSubmit }: Props) => {
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const { guest } = useStoreContext();
  const history = useHistory();
  const [auth] = useAuthToken();
  const [isSending, setIsSending] = useState(false);
  const handleClick = useCallback(async() => {
    setIsSending(true);
    try {
      if (auth) {
        await client.stripe.methods.put({
          headers: auth.authHeader,
          body: {
            methodId: reservation.paymentMethodsId!,
          },
        });
      }
      const created = await client.reservation.post({
        body: reservation as CreateReservationBody,
        ...(auth ? {
          headers: auth.authHeader,
        } : {}),
      });
      onSubmit();
      setNotice(dispatch, '予約が完了しました。', '予約完了');
      history.push(`${process.env.BASE_PATH}/reservation/${created.body.code}`);
    } catch (error) {
      if (error.response?.data) {
        if (Array.isArray(error.response.data)) {
          error.response.data.forEach(({ constraints, property }) => {
            setError(dispatch, Object.values(constraints)[0] as string, property);
          });
        } else {
          setError(dispatch, error.response.data.message ?? error.message);
        }
      }
    } finally {
      if (!unmountRef.current) {
        setIsSending(false);
      }
    }
  }, [hidden]);
  const getGuestKey = (name: string): string => `guest${startWithUppercase(name)}`;
  const hasEmptyField = !guest || RESERVATION_GUEST_FIELDS.some(field => !guest[field]);
  const willChangeInfo = !hasEmptyField && RESERVATION_GUEST_FIELDS.some(field => guest![field] !== (reservation[getGuestKey(field)] ?? ''));

  return hidden ? null : <Box
    shadow="md"
    p={[1, 2, 4]}
    m="2"
    borderWidth={1}
    display={['flex', 'flex', 'inline-block']}
    flexDirection='column'
    minW={['none', 'none', 400]}
  >
    <Grid templateColumns="repeat(1, 1fr)" gap={2} m={4}>
      {ACCOUNT_FIELDS.filter(field => field.name !== 'email').map(field => {
        const key = startWithUppercase(field.name);
        return <Grid key={key} templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
          <GridItem>{field.label}</GridItem>
          <GridItem>{reservation[`guest${key}`]}</GridItem>
        </Grid>;
      })}
      {willChangeInfo && reservation.updateInfo &&
      <Grid templateColumns="repeat(1, 1fr)" gap={3} textAlign="right" fontSize="0.9rem">
        <GridItem>お客様の登録情報を更新する</GridItem>
      </Grid>}
      <Divider />
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>チェックイン</GridItem>
        <GridItem>{format(new Date(reservation.checkin!), 'yyyy/MM/dd HH:mm')}</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>チェックアウト</GridItem>
        <GridItem>{format(new Date(reservation.checkout!), 'yyyy/MM/dd HH:mm')}</GridItem>
      </Grid>
      <Divider />
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>料金</GridItem>
        <GridItem>¥{room!.price.toLocaleString()}/人泊</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>宿泊人数</GridItem>
        <GridItem>{reservation.number!}名様</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>宿泊数</GridItem>
        <GridItem>{nights}泊</GridItem>
      </Grid>
    </Grid>
    <Flex justifyContent="flex-end" alignItems="baseline" mr={4}>
      <Box mr={2}>宿泊料金/合計</Box>
      <Box fontWeight="bold" fontSize="2rem">¥{(room!.price * reservation.number! * nights).toLocaleString()}</Box>
    </Flex>
    <Center>
      <Button m={1} onClick={handleClick} disabled={isSending}>予約</Button>
      <Button m={1} colorScheme="red" onClick={onCancel} disabled={isSending}>戻る</Button>
    </Center>
  </Box>;
});

Confirm.displayName = 'Confirm';
export default Confirm;
