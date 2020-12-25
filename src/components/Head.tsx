import type { FC } from 'react';
import { useMemo } from 'react';
import NextHead from 'next/head';
import { useStoreContext } from '~/store';

const Head: FC = () => {
  const { title } = useStoreContext();

  return useMemo(() => <NextHead>
    <title>{title ? `${title} - ` : ''}Reservation System</title>
    <link rel="icon" href="/favicon.png"/>
  </NextHead>, [title]);
};

export default Head;
