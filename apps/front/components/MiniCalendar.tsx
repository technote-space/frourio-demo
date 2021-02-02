import type { FC } from 'react';
import { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { getDayOfWeek, getWeekColor, getYear, getMonth, getDate } from '^/utils/date';

type Props = {
  date: Date;
}

const MiniCalendar: FC<Props> = memo(({ date }: Props) => {
  return <Box m={2} width="4.5rem">
    <Box>{getYear(date)}</Box>
    <Box borderWidth={1} borderColor={getWeekColor(date)}>
      <Box fontSize="1rem" lineHeight="1.15rem" bg={getWeekColor(date)} color="white">{getMonth(date)}</Box>
      <Box fontSize="1.5rem" lineHeight="1.8rem" mt={1}>{getDate(date)}</Box>
      <Box fontSize="0.8rem" lineHeight="1rem" mb={1}>({getDayOfWeek(date)})</Box>
    </Box>
  </Box>;
});

MiniCalendar.displayName = 'MiniCalendar';
export default MiniCalendar;
