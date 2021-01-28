import type { FC } from 'react';
import { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer: FC = () => {
  return useMemo(() => <Box as="footer" m={4} textAlign="center">
    <Text fontSize="sm">
      {(new Date()).getFullYear()} — <strong>Frourioの宿</strong>
    </Text>
  </Box>, []);
};

export default Footer;
