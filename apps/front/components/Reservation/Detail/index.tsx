import type { FC } from 'react';
import type { Room } from '$/packages/domain/database/room';
import type { ReservationData } from '../index';
import { memo } from 'react';
import { Box, Center, Heading, Button, Flex } from '@chakra-ui/react';
import SelectRoom from './SelectRoom';
import SelectNumber from './SelectNumber';
import Checkin from './Checkin';
import Checkout from './Checkout';
import Calc from './Calc';

type Props = {
  hidden: boolean;
  room?: Room;
  reservation: ReservationData;
  onChangeRoomId: (id: number) => void;
  onChangeNumber: (number: number) => void;
  onChangeCheckin: (checkin: Date, isChangeTime?: boolean) => void;
  onChangeCheckout: (checkout: Date, isChangeTime?: boolean) => void;
  nights: number;
  onGuestInfo: () => void;
}

const Detail: FC<Props> = memo(({
  hidden,
  room,
  reservation,
  onChangeRoomId,
  onChangeNumber,
  onChangeCheckin,
  onChangeCheckout,
  nights,
  onGuestInfo,
}: Props) => {
  const isValidReservation = !!room && !!reservation.number && nights > 0;

  return <Box
    shadow="md"
    p={[1, 2, 4]}
    m="2"
    borderWidth={1}
    display={hidden ? 'none' : ['flex', 'flex', 'inline-block']}
    flexDirection='column'
    minW={['none', 'none', 400]}
  >
    <Heading as="h4" size="lg">ご予約</Heading>
    <Box>
      <SelectRoom
        room={room}
        onChangeRoomId={onChangeRoomId}
      />
      <SelectNumber
        reservation={reservation}
        room={room}
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
      number={reservation.number!}
      room={room!}
      nights={nights}
    />}
    {isValidReservation && <Center>
      <Button m={1} onClick={onGuestInfo}>次へ</Button>
    </Center>}
  </Box>;
});

Detail.displayName = 'Detail';
export default Detail;
