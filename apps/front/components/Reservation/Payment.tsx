import type { FC } from 'react';
import type { ReservationData } from './index';
import type { StripeElementChangeEvent } from '@stripe/stripe-js';
import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Button, Center, Heading, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAuthToken from '^/hooks/useAuthToken';
import { client } from '^/utils/api';
import { useDispatchContext } from '^/store';
import useFetch from '^/hooks/useFetch';
import { setError } from '^/utils/actions';

type StripeError = {
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
  const stripeIconColor = useColorModeValue('#336', '#c4f0ff');
  const stripeColor = useColorModeValue('#000', '#fff');
  const cardOptions = useMemo(() => ({
    style: {
      base: {
        iconColor: stripeIconColor,
        color: stripeColor,
        fontWeight: '500',
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },
  }), [stripeIconColor, stripeColor]);

  const getPaymentMethodId = async() => {
    if (createNewCard || !reservation.paymentMethodsId) {
      const card = elements?.getElement(CardNumberElement);
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

  const getCardText = method => `${method.card.brand} ****-****-****-${method.card.last4} ${`0${method.card.exp_month}`.slice(-2)}/${String(method.card.exp_year).substring(2, 4)}`;
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

  const createNewCardView = <Box
    display={isCreateNewCard ? 'block' : 'none'}
  >
    <FormControl
      id='card-number'
      isRequired
      isInvalid={typeof cardNumberError === 'object'}
      isDisabled={isSending}
    >
      <FormLabel htmlFor='card-number'>クレジットカード番号</FormLabel>
      <Box p={2} my={2} borderRadius="0.375rem" borderWidth={1} borderStyle="solid" borderColor="inherit" height="2.5rem">
        <CardNumberElement onChange={changeCardInfo('cardNumber')} options={cardOptions} />
      </Box>
      <FormErrorMessage mb={2}>{typeof cardNumberError === 'object' && cardNumberError.message}</FormErrorMessage>
    </FormControl>
    <FormControl
      id='card-expiry'
      isRequired
      isInvalid={typeof cardExpiryError === 'object'}
      isDisabled={isSending}
    >
      <FormLabel htmlFor='card-expiry'>有効期限（XX月/XX年）</FormLabel>
      <Box p={2} my={2} borderRadius="0.375rem" borderWidth={1} borderStyle="solid" borderColor="inherit" height="2.5rem">
        <CardExpiryElement onChange={changeCardInfo('cardExpiry')} options={cardOptions} />
      </Box>
      <FormErrorMessage mb={2}>{typeof cardExpiryError === 'object' && cardExpiryError.message}</FormErrorMessage>
    </FormControl>
    <FormControl
      id='card-cvc'
      isRequired
      isInvalid={typeof cardCvcError === 'object'}
      isDisabled={isSending}
    >
      <FormLabel htmlFor='card-cvc'>セキュリティーコード（カード裏面）</FormLabel>
      <Box p={2} my={2} borderRadius="0.375rem" borderWidth={1} borderStyle="solid" borderColor="inherit" height="2.5rem">
        <CardCvcElement onChange={changeCardInfo('cardCvc')} options={cardOptions} />
      </Box>
      <FormErrorMessage mb={2}>{typeof cardCvcError === 'object' && cardCvcError.message}</FormErrorMessage>
    </FormControl>
  </Box>;
  const selectCardView = isValidPaymentMethods ? <Box
    display={!isCreateNewCard ? 'block' : 'none'}
  >
    <RadioGroup onChange={onChangePaymentMethodsId} value={reservation.paymentMethodsId}>
      <Stack>
        {paymentMethods.data!.map(method => <Radio
          p={1}
          key={`pm-${method.id}`}
          value={method.id}
          disabled={isSending}
        >
          {getCardText(method)}
        </Radio>)}
      </Stack>
    </RadioGroup>
  </Box> : null;

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
      {createNewCardView}
      {selectCardView}
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
