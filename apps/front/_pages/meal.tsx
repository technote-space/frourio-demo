import type { FC } from 'react';
import { Box, Image } from '@chakra-ui/react';

const Meal: FC = () => {
  return <Box m={4}>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/meal1.jpg"/>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/meal2.jpg"/>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/meal3.jpg"/>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/meal4.jpg"/>
  </Box>;
};

export default Meal;
