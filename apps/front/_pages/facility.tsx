import type { FC } from 'react';
import { Box, Image } from '@chakra-ui/react';

const Facility: FC = () => {
  return <Box m={4}>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/facility1.jpg"/>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/facility2.jpg"/>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/facility3.jpg"/>
    <Image width="100%" height={400} p={1} objectFit="cover" src="/facility4.jpg"/>
  </Box>;
};

export default Facility;
