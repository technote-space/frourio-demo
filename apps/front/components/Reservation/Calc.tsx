import type { FC } from 'react';
import type { ReservationData } from './index';
import type { Room } from '$/repositories/room';
import { Flex, Box, Grid, GridItem } from '@chakra-ui/react';

type Props = {
  room?: Room;
  nights: number;
  isValid: boolean;
  reservation: ReservationData;
}

const Calc: FC<Props> = ({ reservation, room, nights, isValid }: Props) => {
  return isValid ? <Box>
    <Grid templateColumns="repeat(1, 1fr)" gap={2} m={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>料金</GridItem>
        <GridItem>¥{room!.price.toLocaleString()}/泊人</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>宿泊人数</GridItem>
        <GridItem>{reservation.number!}名様</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>宿泊数</GridItem>
        <GridItem>{nights}泊</GridItem>
      </Grid>
    </Grid>
    <Flex justifyContent="flex-end" alignItems="baseline" mr={4}>
      <Box mr={2}>宿泊料金/合計</Box>
      <Box fontWeight="bold" fontSize="2rem">¥{(room!.price * reservation.number! * nights).toLocaleString()}</Box>
    </Flex>
  </Box> : null;
};

export default Calc;
