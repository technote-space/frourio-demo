import type { FC } from 'react';
import type { Room } from '$/prisma/client';
import type { ReservationData } from '^/components/Reservation/index';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';
import { memo, useCallback } from 'react';
import { format } from 'date-fns';
import { Flex, Box, Center, Grid, GridItem, Divider, Button } from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { startWithUppercase } from '@frourio-demo/utils/string';
import useAuthToken from '^/hooks/useAuthToken';
import { client } from '^/utils/api';
import { setNotice, setError } from '^/utils/actions';
import { useDispatchContext } from '^/store';
import { ACCOUNT_FIELDS } from '^/utils/constants';

type Props = {
  room?: Room;
  nights: number;
  reservation: ReservationData;
  onCancel: () => void;
}

const Confirm: FC<Props> = memo(({ reservation, room, nights, onCancel }: Props) => {
  const { dispatch } = useDispatchContext();
  const history = useHistory();
  const [auth] = useAuthToken();
  const handleClick = useCallback(async() => {
    try {
      const created = await client.reservation.post({
        body: reservation as CreateReservationBody,
        ...(auth ? {
          headers: auth.authHeader,
        } : {}),
      });
      setNotice(dispatch, '予約が完了しました。', '予約完了');
      history.push(`/reservation/${created.body.id}`);
    } catch (error) {
      if (error.response?.data) {
        error.response.data.forEach(({ constraints, property }) => {
          setError(dispatch, Object.values(constraints)[0] as string, property);
        });
      }
    }
  }, []);

  return <Box px={5}>
    <Grid templateColumns="repeat(1, 1fr)" gap={2} m={4}>
      {ACCOUNT_FIELDS.filter(field => field.name !== 'email').map(field => {
        const key = startWithUppercase(field.name);
        return <Grid key={key} templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
          <GridItem>{field.label}</GridItem>
          <GridItem>{reservation[`guest${key}`]}</GridItem>
        </Grid>;
      })}
      <Divider/>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>チェックイン</GridItem>
        <GridItem>{format(new Date(reservation.checkin!), 'yyyy/MM/dd HH:mm')}</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>チェックアウト</GridItem>
        <GridItem>{format(new Date(reservation.checkout!), 'yyyy/MM/dd HH:mm')}</GridItem>
      </Grid>
      <Divider/>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>料金</GridItem>
        <GridItem>¥{room!.price.toLocaleString()}/泊人</GridItem>
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
      <Button width={120} m={1} colorScheme="teal" onClick={handleClick}>予約</Button>
      <Button width={120} m={1} colorScheme="red" onClick={onCancel}>戻る</Button>
    </Center>
  </Box>;
});

Confirm.displayName = 'Confirm';
export default Confirm;
