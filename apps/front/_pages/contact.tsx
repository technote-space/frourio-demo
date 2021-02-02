import type { FC } from 'react';
import { memo } from 'react';
import { Box, Heading, Icon } from '@chakra-ui/react';
import { IoMdConstruct } from 'react-icons/io';

const Contact: FC = memo(() => {
  return <Box m={4}>
    <Heading m={2}>お問い合わせ</Heading>
    <Icon as={IoMdConstruct}/> 工事中...
  </Box>;
});

Contact.displayName = 'Contact';
export default Contact;
