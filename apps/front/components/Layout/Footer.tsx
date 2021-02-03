import type { FC } from 'react';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Box, Text, Link } from '@chakra-ui/react';

const Footer: FC = memo(() => {
  return <Flex as="footer" m={4} flexDirection="column" alignItems="center">
    <Flex mb={2} flexDirection={['column', 'row']} alignItems="center">
      <Link as={RouterLink} to={`${process.env.BASE_PATH}/terms`} mx={2}>利用規約</Link>
      <Link as={RouterLink} to={`${process.env.BASE_PATH}/privacy`} mx={2}>プライバシーポリシー</Link>
      <Link as={RouterLink} to={`${process.env.BASE_PATH}/contact`} mx={2}>お問い合わせ</Link>
    </Flex>
    <Box>
      <Text fontSize="sm">
        {(new Date()).getFullYear()} — <strong>Frourioの宿</strong>
      </Text>
    </Box>
  </Flex>;
});

Footer.displayName = 'Footer';
export default Footer;
