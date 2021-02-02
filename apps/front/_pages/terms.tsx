import type { FC } from 'react';
import { memo } from 'react';
import { Box, Heading, Icon } from '@chakra-ui/react';
import { IoMdConstruct } from 'react-icons/io';

const Terms: FC = memo(() => {
  return <Box m={4}>
    <Heading m={2}>利用規約</Heading>
    <Icon as={IoMdConstruct}/> 工事中...
  </Box>;
});

Terms.displayName = 'Terms';
export default Terms;
