import type { FC } from 'react';
import { memo } from 'react';
import { Box, Heading, Icon } from '@chakra-ui/react';
import { IoMdConstruct } from 'react-icons/io';

const Info: FC = memo(() => {
  return <Box m={4}>
    <Heading m={2}>お知らせ</Heading>
    <Icon as={IoMdConstruct}/> 工事中...
  </Box>;
});

Info.displayName = 'Info';
export default Info;
