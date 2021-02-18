import type { FC } from 'react';
import type { ReservationData } from '../index';
import { memo } from 'react';
import { Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';

type Props = {
  reservation: ReservationData;
  paymentMethods: { id: string; card?: { brand: string; last4: string; 'exp_month': number; 'exp_year': number; } }[];
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
  const getCardText = method => `${method.card.brand} ****-****-****-${method.card.last4} ${`0${method.card.exp_month}`.slice(-2)}/${String(method.card.exp_year).substring(2, 4)}`;
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
