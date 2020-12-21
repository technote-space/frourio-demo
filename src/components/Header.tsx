import { FC } from 'react';
import Head from 'next/head';
import styles from '~/styles/components/Header.module.scss';

const Header: FC = () => {
  return <div className={styles.wrap}>
    <Head>
      <title>frourio-todo-app</title>
      <link rel="icon" href="/favicon.png"/>
    </Head>
  </div>;
};

export default Header;
