import type { FC } from 'react';
import type { Room } from '$/packages/domain/database/room';
import { memo } from 'react';
import { Flex, Box, Grid, GridItem } from '@chakra-ui/react';

type Props = {
  room: Room;
  nights: number;
  number: number;
}

const Calc: FC<Props> = memo(({ room, number, nights }: Props) => {
  return <Box>
    <Grid templateColumns="repeat(1, 1fr)" gap={2} m={4}>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>料金</GridItem>
        <GridItem>¥{room.price.toLocaleString()}/人泊</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>宿泊人数</GridItem>
        <GridItem>{number}名様</GridItem>
      </Grid>
      <Grid templateColumns="repeat(2, 1fr)" gap={3} textAlign="right">
        <GridItem>宿泊数</GridItem>
        <GridItem>{nights}泊</GridItem>
      </Grid>
    </Grid>
    <Flex justifyContent="flex-end" alignItems="baseline" mr={4}>
      <Box mr={2}>宿泊料金/合計</Box>
      <Box fontWeight="bold" fontSize="2rem">¥{(room.price * number * nights).toLocaleString()}</Box>
    </Flex>
  </Box>;
});

Calc.displayName = 'Calc';
export default Calc;
