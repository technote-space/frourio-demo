import type { FC } from 'react';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';
import { memo, useState, useEffect, useCallback } from 'react';
import { Box, Center, Heading, Button, Grid } from '@chakra-ui/react';
import { useDispatchContext, useStoreContext } from '^/store';
import useFetch from '^/hooks/useFetch';
import { client } from '^/utils/api';
import { getNights } from '@frourio-demo/utils/calc';
import SelectRoom from './SelectRoom';
import SelectNumber from './SelectNumber';
import GuestInfo from './GuestInfo';
import Checkin from './Checkin';
import Checkout from './Checkout';
import Calc from './Calc';
import Confirm from './Confirm';

export type ReservationData = Partial<CreateReservationBody>;
type Props = {
  roomId?: number;
}

const Reservation: FC<Props> = memo(({ roomId }: Props) => {
  const { dispatch } = useDispatchContext();
  const { guest } = useStoreContext();
  const [confirm, setConfirm] = useState(false);
  const [reservation, setReservation] = useState<ReservationData>({
    roomId,
    number: 1,
  });
  const room = useFetch(dispatch, undefined, client.reservation.rooms._roomId(reservation.roomId!), { enabled: !!reservation.roomId });
  const nights = reservation.checkin && reservation.checkout ? getNights(reservation.checkin, reservation.checkout) : -1;
  const isValid = !!room.data && !!reservation.number && nights > 0;

  const onChangeRoomId = (id: number) => {
    setReservation({
      ...reservation,
      roomId: id,
      number: 1,
      checkin: undefined,
      checkout: undefined,
    });
  };
  const onChangeNumber = (number: number) => {
    setReservation({ ...reservation, number });
  };
  const onChangeCheckin = (checkin: Date, isChangeTime?: boolean) => {
    setReservation({
      ...reservation,
      ...(isChangeTime ? {} : { checkout: undefined }),
      checkin: checkin.toISOString(),
    });
  };
  const onChangeCheckout = (checkout: Date) => {
    setReservation({ ...reservation, checkout: checkout.toISOString() });
  };
  const onChangeName = (name: string) => {
    setReservation({ ...reservation, guestName: name });
  };
  const onChangeNameKana = (name: string) => {
    setReservation({ ...reservation, guestNameKana: name });
  };
  const onChangeZipCode = (zipcode: string) => {
    setReservation({ ...reservation, guestZipCode: zipcode });
  };
  const onChangeAddress = (address: string) => {
    setReservation({ ...reservation, guestAddress: address });
  };
  const onChangePhone = (phone: string) => {
    setReservation({ ...reservation, guestPhone: phone });
  };
  const onChangeUpdateInfo = (updateInfo: string) => {
    console.log(updateInfo);
    setReservation({ ...reservation, updateInfo: !reservation.updateInfo });
  };
  const handleClickConfirm = useCallback(() => {
    setConfirm(true);
  }, []);
  const handleClickCancel = useCallback(() => {
    setConfirm(false);
  }, []);

  useEffect(() => {
    if (guest) {
      setReservation(
        {
          guestId: guest.id,
          guestName: guest.name ?? undefined,
          guestNameKana: guest.nameKana ?? undefined,
          guestZipCode: guest.zipCode ?? undefined,
          guestAddress: guest.address ?? undefined,
          guestPhone: guest.phone ?? undefined,
          ...reservation,
        },
      );
    }
  }, [guest]);

  return guest ? confirm ? <Box shadow="md" p="4" m="2" borderWidth={1}>
    <Confirm
      room={room.data}
      reservation={reservation}
      nights={nights}
      onCancel={handleClickCancel}
    />
  </Box> : <Box shadow="md" p="4" m="2" borderWidth={1}>
    <Heading as="h4" size="lg">ご予約</Heading>
    <Grid templateColumns="repeat(2, 1fr)" gap={2}>
      <SelectRoom
        room={room.data}
        onChangeRoomId={onChangeRoomId}
      />
      <SelectNumber
        reservation={reservation}
        room={room.data}
        onChangeNumber={onChangeNumber}
      />
      <Checkin
        reservation={reservation}
        onChange={onChangeCheckin}
      />
      <Checkout
        reservation={reservation}
        onChange={onChangeCheckout}
      />
      <GuestInfo
        reservation={reservation}
        onChangeName={onChangeName}
        onChangeNameKana={onChangeNameKana}
        onChangeZipCode={onChangeZipCode}
        onChangeAddress={onChangeAddress}
        onChangePhone={onChangePhone}
        onChangeUpdateInfo={onChangeUpdateInfo}
      />
    </Grid>
    <Calc
      room={room.data}
      reservation={reservation}
      nights={nights}
      isValid={isValid}
    />
    {isValid && <Center>
      <Button width={120} m={1} colorScheme="teal" onClick={handleClickConfirm}>確認</Button>
    </Center>}
  </Box> : null;
});

export default Reservation;
