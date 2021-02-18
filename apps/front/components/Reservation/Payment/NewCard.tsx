import type { FC } from 'react';
import type { StripeElementChangeEvent } from '@stripe/stripe-js';
import type { StripeError } from '.';
import { memo, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useColorModeValue } from '@chakra-ui/react';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';

type Props = {
  isCreateNewCard: boolean;
  cardNumberError: StripeError | string;
  cardExpiryError: StripeError | string;
  cardCvcError: StripeError | string;
  isSending: boolean;
  changeCardInfo: (id: string) => (event: StripeElementChangeEvent) => void;
}

const NewCard: FC<Props> = memo(({
  isCreateNewCard,
  cardNumberError,
  cardExpiryError,
  cardCvcError,
  isSending,
  changeCardInfo,
}: Props) => {
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

  return <Box
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
});

NewCard.displayName = 'NewCard';
export default NewCard;
