import type { FC } from 'react';
import { memo } from 'react';
import { Box, Image } from '@chakra-ui/react';

const Qr: FC = memo(() => {
  return <Box m={4}>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/favicon.png`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/favicon.png`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/favicon.png`}/>
    <Image width="100%" height={[200, 300, 400]} p={1} objectFit="cover" src={`${process.env.BASE_PATH}/favicon.png`}/>
  </Box>;
});

Qr.displayName = 'Meal';
export default Qr;
