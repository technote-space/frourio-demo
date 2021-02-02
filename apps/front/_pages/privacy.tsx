import type { FC } from 'react';
import { memo } from 'react';
import { Box, Heading, Icon } from '@chakra-ui/react';
import { IoMdConstruct } from 'react-icons/io';

const Privacy: FC = memo(() => {
  return <Box m={4}>
    <Heading m={2}>プライバシーポリシー</Heading>
    <Icon as={IoMdConstruct}/> 工事中...
  </Box>;
});

Privacy.displayName = 'Privacy';
export default Privacy;
