import type { FC } from 'react';
import { memo } from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer: FC = memo(() => {
  return <Box as="footer" m={4} textAlign="center">
    <Text fontSize="sm">
      {(new Date()).getFullYear()} — <strong>Frourioの宿</strong>
    </Text>
  </Box>;
});

Footer.displayName = 'Footer';
export default Footer;
