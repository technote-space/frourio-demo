import type { FC } from 'react';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';
import { memo, useState, useEffect, useCallback } from 'react';
import { Box, Center, Heading, Button, Flex } from '@chakra-ui/react';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';
import { useDispatchContext, useStoreContext } from '^/store';
import useFetch from '^/hooks/useFetch';
import { client } from '^/utils/api';
import { getNights } from '@frourio-demo/utils/calc';
import { startWithUppercase } from '@frourio-demo/utils/string';
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

type ReservationMode = 'detail' | 'guest' | 'confirm'

const Reservation: FC<Props> = memo(({ roomId }: Props) => {
  const initialReservation = {
    roomId,
    number: 1,
    updateInfo: true,
  };
  const { dispatch } = useDispatchContext();
  const { guest } = useStoreContext();
  const [mode, setMode] = useState<ReservationMode>('detail');
  const [reservation, setReservation] = useState<ReservationData>(initialReservation);
  const room = useFetch(dispatch, undefined, client.reservation.rooms._roomId(reservation.roomId!), { enabled: !!reservation.roomId });
  const nights = reservation.checkin && reservation.checkout ? getNights(reservation.checkin, reservation.checkout) : -1;
  const isValidReservation = !!room.data && !!reservation.number && nights > 0;
  const isValidGuest = !RESERVATION_GUEST_FIELDS.some(field => !reservation[`guest${startWithUppercase(field)}`]);

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
  const onChangeUpdateInfo = () => {
    setReservation({ ...reservation, updateInfo: !reservation.updateInfo });
  };
  const onGuestInfo = useCallback(() => {
    setMode('guest');
  }, []);
  const onConfirm = useCallback(() => {
    setMode('confirm');
  }, []);
  const onDetail = useCallback(() => {
    setMode('detail');
  }, []);
  const handleSubmit = useCallback(() => {
    setMode('detail');
    setReservation(initialReservation);
  }, []);

  useEffect(() => {
    if (guest) {
      setReservation(
        {
          guestId: guest.id,
          ...Object.assign({}, ...RESERVATION_GUEST_FIELDS.map(field => ({ [`guest${startWithUppercase(field)}`]: guest[field] ?? undefined }))),
          ...reservation,
        },
      );
    }
  }, [guest]);

  if (!guest) {
    return null;
  }

  if (mode === 'detail') {
    return <Box
      shadow="md"
      p={[1, 2, 4]}
      m="2"
      borderWidth={1}
      display={['flex', 'flex', 'inline-block']}
      flexDirection='column'
      minW={['none', 'none', 400]}
    >
      <Heading as="h4" size="lg">ご予約</Heading>
      <Box>
        <SelectRoom
          room={room.data}
          onChangeRoomId={onChangeRoomId}
        />
        <SelectNumber
          reservation={reservation}
          room={room.data}
          onChangeNumber={onChangeNumber}
        />
        <Flex>
          <Checkin
            reservation={reservation}
            onChange={onChangeCheckin}
          />
          <Checkout
            reservation={reservation}
            onChange={onChangeCheckout}
          />
        </Flex>
      </Box>
      {isValidReservation && <Calc
        reservation={reservation}
        room={room.data}
        nights={nights}
      />}
      {isValidReservation && <Center>
        <Button width={120} m={1} colorScheme="teal" onClick={onGuestInfo}>次へ</Button>
      </Center>}
    </Box>;
  }

  if (mode === 'guest') {
    return <Box
      shadow="md"
      p="4"
      m="2"
      borderWidth={1}
      display="inline-block"
      minW={400}
    >
      <Heading as="h4" size="lg">ご予約</Heading>
      <GuestInfo
        reservation={reservation}
        onChangeName={onChangeName}
        onChangeNameKana={onChangeNameKana}
        onChangeZipCode={onChangeZipCode}
        onChangeAddress={onChangeAddress}
        onChangePhone={onChangePhone}
        onChangeUpdateInfo={onChangeUpdateInfo}
      />
      <Center>
        <Button width={120} m={1} colorScheme="teal" onClick={onConfirm} disabled={!isValidGuest}>確認</Button>
        <Button width={120} m={1} onClick={onDetail}>戻る</Button>
      </Center>
    </Box>;
  }

  return <Box
    shadow="md"
    p="4"
    m="2"
    borderWidth={1}
    display="inline-block"
    minW={400}
  >
    <Confirm
      room={room.data}
      reservation={reservation}
      nights={nights}
      onCancel={onGuestInfo}
      onSubmit={handleSubmit}
    />
  </Box>;
});

export default Reservation;
