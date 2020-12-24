import type { FC } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import styles from '~/styles/layouts/Common.module.scss';
import { PropsWithChildren } from 'react';

const Layout: FC = ({ children }: PropsWithChildren<{}>) => {
  return <div className={styles.wrap}>
    <Header/>
    <Sidebar/>
    <main className={styles.main}>
      <div className={styles.contents}>
        {children}
      </div>
    </main>
    <Footer/>
  </div>;
};

export default Layout;
