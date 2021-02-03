import type { FC } from 'react';
import { memo } from 'react';
import { Box, Image } from '@chakra-ui/react';

const Facility: FC = memo(() => {
  return <Box m={4}>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/facility1.jpg`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/facility2.jpg`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/facility3.jpg`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/facility4.jpg`}/>
  </Box>;
});

Facility.displayName = 'Facility';
export default Facility;
