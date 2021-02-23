import type { FC } from 'react';
import type { ReservationData } from '../index';
import type { PaymentMethod } from '$/domain/payment';
import { memo } from 'react';
import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';

type Props = {
  reservation: ReservationData;
  paymentMethods: PaymentMethod[];
  isValidPaymentMethods: boolean;
  isCreateNewCard: boolean;
  isSending: boolean;
  onChangePaymentMethodsId: (id: string) => void;
}

const SelectCard: FC<Props> = memo(({
  reservation,
  paymentMethods,
  isValidPaymentMethods,
  isCreateNewCard,
  isSending,
  onChangePaymentMethodsId,
}: Props) => {
  const getCardText = (method: PaymentMethod) => `${method.card.brand} ****-****-****-${method.card.last4} ${`0${method.card.expMonth}`.slice(-2)}/${String(method.card.expYear).substring(2, 4)}`;
  return isValidPaymentMethods ? <Box
    display={!isCreateNewCard ? 'block' : 'none'}
  >
    <RadioGroup onChange={onChangePaymentMethodsId} value={reservation.paymentMethodsId}>
      <Stack>
        {paymentMethods.map(method => <Radio
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
});

SelectCard.displayName = 'SelectCard';
export default SelectCard;
