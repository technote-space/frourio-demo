import type { FC } from 'react';
import type { ReservationData } from '../index';
import type { Room } from '$/repositories/room';
import { memo } from 'react';
import { Box, Heading, Select } from '@chakra-ui/react';

type Props = {
  reservation: ReservationData;
  room?: Room;
  onChangeNumber: (number: number) => void;
}

const SelectNumber: FC<Props> = memo(({ reservation, room, onChangeNumber }: Props) => {
  const handleChangeNumber = event => {
    onChangeNumber(Number(event.target.value));
  };

  return <Box m={1} p={2} height="100%">
    <Heading as="h4" size="md">宿泊人数</Heading>
    <Select mt={1} onChange={handleChangeNumber} value={reservation.number ?? 1} disabled={!room}>
      {[...Array(room ? room.number : 1).keys()]
        .map(index => index + 1)
        .map(number => <option key={number} value={number}>{number}名様</option>)}
    </Select>
  </Box>;
});

SelectNumber.displayName = 'SelectNumber';
export default SelectNumber;
