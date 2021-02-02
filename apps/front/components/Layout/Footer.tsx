import type { FC } from 'react';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Text, Link } from '@chakra-ui/react';

const Footer: FC = memo(() => {
  return <Flex as="footer" m={4} flexDirection="column" alignItems="center">
    <Box mb={2}>
      <Link as={RouterLink} to={`${process.env.BASE_PATH}/terms`} mx={3}>利用規約</Link>
      <Link as={RouterLink} to={`${process.env.BASE_PATH}/privacy`} mx={3}>プライバシーポリシー</Link>
      <Link as={RouterLink} to={`${process.env.BASE_PATH}/contact`} mx={3}>お問い合わせ</Link>
    </Box>
    <Box>
      <Text fontSize="sm">
        {(new Date()).getFullYear()} — <strong>Frourioの宿</strong>
      </Text>
    </Box>
  </Flex>;
});

Footer.displayName = 'Footer';
export default Footer;
