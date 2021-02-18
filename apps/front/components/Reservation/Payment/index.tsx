import type { FC } from 'react';
import type { ReservationData } from '../index';
import type { StripeElementChangeEvent } from '@stripe/stripe-js';
import { memo, useState, useEffect, useCallback } from 'react';
import { Box, Button, Center, Heading } from '@chakra-ui/react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import useAuthToken from '^/hooks/useAuthToken';
import { client } from '^/utils/api';
import { useDispatchContext } from '^/store';
import useFetch from '^/hooks/useFetch';
import { setError } from '^/utils/actions';
import NewCard from './NewCard';
import SelectCard from './SelectCard';

export type StripeError = {
  type: 'validation_error';
  code: string;
  message: string;
}

type Props = {
  hidden: boolean;
  reservation: ReservationData;
  onChangePaymentMethodsId: (id: string) => void;
  onConfirm: () => void;
  onGuestInfo: () => void;
}

const Payment: FC<Props> = memo(({ reservation, hidden, onChangePaymentMethodsId, onConfirm, onGuestInfo }: Props) => {
  const [auth] = useAuthToken();
  const stripe = useStripe();
  const elements = useElements();
  const { dispatch } = useDispatchContext();
  const [cardNumberError, setCardNumberError] = useState<StripeError | string>('empty');
  const [cardExpiryError, setCardExpiryError] = useState<StripeError | string>('empty');
  const [cardCvcError, setCardCvcError] = useState<StripeError | string>('empty');
  const [createNewCard, setCreateNewCard] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const paymentMethods = useFetch(dispatch, [], client.stripe.methods, {
    headers: auth?.authHeader!, // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
    enabled: !!auth,
  });
  const defaultPayment = useFetch(dispatch, {}, client.stripe.method, {
    headers: auth?.authHeader!, // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
    enabled: !!auth,
  });
  const isValidPaymentMethods = !!paymentMethods.data && !!paymentMethods.data.length;
  const isCreateNewCard = createNewCard || !isValidPaymentMethods;
  const isDisabledConfirm =
    (isCreateNewCard && (!!cardNumberError || !!cardExpiryError || !!cardCvcError)) ||
    (!isCreateNewCard && !reservation.paymentMethodsId);

  const getPaymentMethodId = async() => {
    if (createNewCard || !reservation.paymentMethodsId) {
      const card = elements?.getElement('cardNumber');
      if (!card) {
        throw new Error('Stripeは使用できません。時間をおいてから再度お試しください。');
      }

      setIsSending(true);
      const method = await stripe!.createPaymentMethod({
        type: 'card',
        card,
        'billing_details': {
          email: reservation.guestEmail!,
          name: reservation.guestName!,
        },
      });
      if (method.error) {
        throw method.error;
      }

      return method.paymentMethod!.id;
    }

    return reservation.paymentMethodsId;
  };
  const handleClickConfirm = useCallback(async() => {
    try {
      onChangePaymentMethodsId(await getPaymentMethodId());
      onConfirm();
    } catch (error) {
      setError(dispatch, error.message);
    } finally {
      setIsSending(false);
    }
  }, [createNewCard, reservation, elements]);
  const handleClickSwitchButton = useCallback(() => {
    setCreateNewCard(!createNewCard);
  }, [createNewCard]);

  const changeCardInfo = (id: string) => (event: StripeElementChangeEvent) => {
    const setters = {
      'cardNumber': setCardNumberError,
      'cardExpiry': setCardExpiryError,
      'cardCvc': setCardCvcError,
    };
    if (event.error) {
      setters[id](event.error);
    } else if (event.complete) {
      setters[id]('');
    }
  };

  useEffect(() => {
    console.log(defaultPayment.data);
    if (!reservation.paymentMethodsId && defaultPayment.data?.id) {
      onChangePaymentMethodsId(defaultPayment.data.id);
    }
  }, [defaultPayment.data]);

  return <Box
    shadow="md"
    p={[1, 2, 4]}
    m="2"
    borderWidth={1}
    display={hidden || !elements ? 'none' : ['flex', 'flex', 'inline-block']}
    flexDirection='column'
    minW={['none', 'none', 400]}
  >
    <Heading as="h4" size="lg">お支払い方法</Heading>
    <Box m={1} p={2} height="100%">
      <NewCard
        isCreateNewCard={isCreateNewCard}
        cardNumberError={cardNumberError}
        cardExpiryError={cardExpiryError}
        cardCvcError={cardCvcError}
        isSending={isSending}
        changeCardInfo={changeCardInfo}
      />
      <SelectCard
        reservation={reservation}
        paymentMethods={paymentMethods.data!}
        isValidPaymentMethods={isValidPaymentMethods}
        isCreateNewCard={isCreateNewCard}
        isSending={isSending}
        onChangePaymentMethodsId={onChangePaymentMethodsId}
      />
      {isValidPaymentMethods && <Center>
        <Button m={1} mt={3} onClick={handleClickSwitchButton} disabled={isSending}>
          {createNewCard ? 'カードを選択' : '新しいカード'}
        </Button>
      </Center>}
    </Box>
    <Center>
      <Button m={1} onClick={handleClickConfirm} disabled={isDisabledConfirm || isSending}>
        確認
      </Button>
      <Button m={1} colorScheme="red" onClick={onGuestInfo} disabled={isSending}>
        戻る
      </Button>
    </Center>
  </Box>;
});

Payment.displayName = 'Payment';
export default Payment;
