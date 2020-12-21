import type { FC } from 'react';
import { useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import styles from '~/styles/components/Footer.module.scss';

const Footer: FC = () => {
  return <Flex
    wrap="wrap"
    padding="1rem"
    bg="teal.500"
    color="white"
    alignItems="center"
    justifyContent="center"
    className={styles.wrap}
  >
    <Text m={1}>{(new Date()).getFullYear()}</Text>
    <Text m={1}>-</Text>
    <Text m={1} fontWeight="bold">予約システム</Text>
  </Flex>;
};

export default Footer;
