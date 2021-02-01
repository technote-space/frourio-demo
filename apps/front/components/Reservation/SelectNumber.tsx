import type { FC } from 'react';
import type { ReservationData } from './index';
import type { Room } from '$/repositories/room';
import { memo } from 'react';
import { Box, Heading, Select, GridItem } from '@chakra-ui/react';

type Props = {
  reservation: ReservationData;
  room?: Room;
  onChangeNumber: (number: number) => void;
}

const SelectNumber: FC<Props> = memo(({ reservation, room, onChangeNumber }: Props) => {
  const handleChangeNumber = event => {
    onChangeNumber(Number(event.target.value));
  };

  return room ? <GridItem>
    <Box m={1} p={2} borderWidth={1} height="100%">
      <Heading as="h4" size="md">宿泊人数</Heading>
      <Select mt={1} onChange={handleChangeNumber} value={reservation.number ?? 1}>
        {[...Array(room.number).keys()]
          .map(index => index + 1)
          .map(number => <option key={number} value={number}>{number}名様</option>)}
      </Select>
    </Box>
  </GridItem> : null;
});

SelectNumber.displayName = 'SelectNumber';
export default SelectNumber;
