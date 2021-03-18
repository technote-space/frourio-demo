import type { FC } from 'react';
import type { CreateReservationBody } from '$/packages/application/usecase/front/reservation/validators';
import { memo, useState, useEffect, useCallback } from 'react';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useDispatchContext } from '^/store';
import useFetch from '^/hooks/useFetch';
import useAuthToken from '^/hooks/useAuthToken';
import { onRefreshToken } from '^/utils/actions';
import { client } from '^/utils/api';
import { getNights } from '@frourio-demo/utils/calc';
import { startWithUppercase } from '@frourio-demo/utils/string';
import Account from './Account';
import Detail from './Detail';
import GuestInfo from './GuestInfo';
import Confirm from './Confirm';
import Payment from './Payment';
import config from '^/stripe.json';

export type ReservationData = Partial<CreateReservationBody>;
type Props = {
  roomId?: number;
}
type ReservationMode = 'account' | 'detail' | 'guest' | 'payment' | 'confirm';
const stripePromise = loadStripe(config.publicKey);

const Reservation: FC<Props> = memo(({ roomId }: Props) => {
  const initialReservation = {
    roomId,
    number: 1,
    updateInfo: true,
  };
  const [auth] = useAuthToken();
  const { dispatch } = useDispatchContext();
  const [mode, setMode] = useState<ReservationMode>('account');
  const [reservation, setReservation] = useState<ReservationData>(initialReservation);
  const guestInfo = useFetch(dispatch, {}, client.reservation.guest, {
    headers: auth?.authHeader,
  });
  const room = useFetch(dispatch, undefined, client.reservation.rooms._roomId(reservation.roomId!), { enabled: !!reservation.roomId });
  const nights = reservation.checkin && reservation.checkout ? getNights(reservation.checkin, reservation.checkout) : -1;

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
  const onChangeEmail = (email: string) => {
    setReservation({ ...reservation, guestEmail: email });
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
  const onChangePaymentMethodsId = (paymentMethodsId: string) => {
    setReservation({ ...reservation, paymentMethodsId });
  };
  const onChangeUpdateInfo = () => {
    setReservation({ ...reservation, updateInfo: !reservation.updateInfo });
  };
  const onDetail = useCallback(() => {
    setMode('detail');
  }, []);
  const onGuestInfo = useCallback(() => {
    setMode('guest');
  }, []);
  const onPayment = useCallback(() => {
    setMode('payment');
  }, []);
  const onConfirm = useCallback(async() => {
    setMode('confirm');
  }, []);
  const handleSubmit = useCallback(() => {
    setMode('account');
    setReservation(initialReservation);
    guestInfo.revalidate().then();
    onRefreshToken(dispatch);
  }, []);

  useEffect(() => {
    if (auth && guestInfo.data && mode === 'guest') {
      const guest = guestInfo.data;
      setReservation(
        {
          guestId: guest.id,
          ...reservation,
          ...Object.assign({}, ...RESERVATION_GUEST_FIELDS.map(field => ({ [`guest${startWithUppercase(field)}`]: reservation[`guest${startWithUppercase(field)}`] || guest[field] || '' }))),
        },
      );
    }
  }, [auth, guestInfo.data, mode]);

  return <>
    <Account
      hidden={mode !== 'account'}
      onDetail={onDetail}
    />
    <Detail
      hidden={mode !== 'detail'}
      room={room.data}
      reservation={reservation}
      onChangeRoomId={onChangeRoomId}
      onChangeNumber={onChangeNumber}
      onChangeCheckin={onChangeCheckin}
      onChangeCheckout={onChangeCheckout}
      nights={nights}
      onGuestInfo={onGuestInfo}
    />
    <GuestInfo
      hidden={mode !== 'guest'}
      reservation={reservation}
      onChangeEmail={onChangeEmail}
      onChangeName={onChangeName}
      onChangeNameKana={onChangeNameKana}
      onChangeZipCode={onChangeZipCode}
      onChangeAddress={onChangeAddress}
      onChangePhone={onChangePhone}
      onChangeUpdateInfo={onChangeUpdateInfo}
      onPayment={onPayment}
      onDetail={onDetail}
    />
    <Elements stripe={stripePromise}>
      <Payment
        hidden={mode !== 'payment'}
        reservation={reservation}
        onChangePaymentMethodsId={onChangePaymentMethodsId}
        onConfirm={onConfirm}
        onGuestInfo={onGuestInfo}
      />
    </Elements>
    <Confirm
      hidden={mode !== 'confirm'}
      room={room.data}
      reservation={reservation}
      nights={nights}
      onCancel={onPayment}
      onSubmit={handleSubmit}
    />
  </>;
});

export default Reservation;
