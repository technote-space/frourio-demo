import type { FC } from 'react';
import { memo } from 'react';
import { Box, Image } from '@chakra-ui/react';

const Meal: FC = memo(() => {
  return <Box m={4}>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/meal1.jpg`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/meal2.jpg`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/meal3.jpg`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/meal4.jpg`}/>
  </Box>;
});

Meal.displayName = 'Meal';
export default Meal;
