import type { FC } from 'react';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Box, Center, Heading, Button } from '@chakra-ui/react';
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

const Reservation: FC<Props> = ({ roomId }: Props) => {
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

  const onChangeRoomId = useCallback((id: number) => {
    setReservation({
      ...reservation,
      roomId: id,
      number: 1,
      checkin: undefined,
      checkout: undefined,
    });
  }, [reservation]);
  const onChangeNumber = useCallback((number: number) => {
    setReservation({ ...reservation, number });
  }, [reservation]);
  const onChangeCheckin = useCallback((checkin: Date, isChangeTime?: boolean) => {
    setReservation({
      ...reservation,
      ...(isChangeTime ? {} : { checkout: undefined }),
      checkin: checkin.toISOString(),
    });
  }, [reservation]);
  const onChangeCheckout = useCallback((checkout: Date) => {
    setReservation({ ...reservation, checkout: checkout.toISOString() });
  }, [reservation]);
  const onChangeName = useCallback((name: string) => {
    setReservation({ ...reservation, guestName: name });
  }, [reservation]);
  const onChangeNameKana = useCallback((name: string) => {
    setReservation({ ...reservation, guestNameKana: name });
  }, [reservation]);
  const onChangeZipCode = useCallback((zipcode: string) => {
    setReservation({ ...reservation, guestZipCode: zipcode });
  }, [reservation]);
  const onChangeAddress = useCallback((address: string) => {
    setReservation({ ...reservation, guestAddress: address });
  }, [reservation]);
  const onChangePhone = useCallback((phone: string) => {
    setReservation({ ...reservation, guestPhone: phone });
  }, [reservation]);
  const onChangeUpdateInfo = useCallback((updateInfo: string) => {
    console.log(updateInfo);
    setReservation({ ...reservation, updateInfo: !reservation.updateInfo });
  }, [reservation]);
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

  console.log(reservation);
  return useMemo(() => confirm ? <Box shadow="md" maxW="sm" p="4" m="2">
    <Confirm
      room={room.data}
      reservation={reservation}
      nights={nights}
      onCancel={handleClickCancel}
    />
  </Box> : <Box shadow="md" maxW="sm" p="4" m="2">
    <Heading as="h4" size="lg">ご予約</Heading>
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
    <Calc
      room={room.data}
      reservation={reservation}
      nights={nights}
      isValid={isValid}
    />
    {isValid && <Center>
      <Button width={120} m={1} colorScheme="teal" onClick={handleClickConfirm}>確認</Button>
    </Center>}
  </Box>, [confirm, isValid, reservation, room.data]);
};

export default Reservation;
