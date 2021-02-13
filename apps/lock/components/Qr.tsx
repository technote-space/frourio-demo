import type { FC } from 'react';
import { memo } from 'react';
import { Wrap, Box, Center, Heading, Button } from '@chakra-ui/react';

type Props = {
  roomId: number;
  isSending: boolean;
  setIsSending: (flag: boolean) => void;
}

const Checkout: FC<Props> = memo(({ roomId, isSending, setIsSending }: Props) => {

  return null;
});

Checkout.displayName = 'Checkout';
export default Checkout;
