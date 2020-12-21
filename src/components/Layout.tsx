import type { FC } from 'react';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import Sidebar from '~/components/Sidebar';
import styles from '~/styles/layouts/Common.module.scss';
import { PropsWithChildren } from 'react';

const Layout: FC = ({ children }: PropsWithChildren<{}>) => {
  return <div className={styles.wrap}>
    <Header/>
    <Sidebar/>
    <main className={styles.main}>
      {children}
    </main>
    <Footer/>
  </div>;
};

export default Layout;
