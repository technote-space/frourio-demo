import type { FC } from 'react';
import type { ReservationData } from './index';
import type { Room } from '$/repositories/room';
import { memo, useCallback } from 'react';
import { Box, Heading, Select } from '@chakra-ui/react';

type Props = {
  reservation: ReservationData;
  room?: Room;
  onChangeNumber: (number: number) => void;
}

const SelectNumber: FC<Props> = memo(({ reservation, room, onChangeNumber }: Props) => {
  const handleChangeNumber = useCallback(event => {
    onChangeNumber(Number(event.target.value));
  }, [onChangeNumber]);

  return room ? <Box m={1} p={2} borderWidth={1}>
    <Heading as="h4" size="md">宿泊人数</Heading>
    <Select mt={1} onChange={handleChangeNumber} value={reservation.number ?? 1}>
      {[...Array(room.number).keys()]
        .map(index => index + 1)
        .map(number => <option key={number} value={number}>{number}名様</option>)}
    </Select>
  </Box> : null;
});

SelectNumber.displayName = 'SelectNumber';
export default SelectNumber;
