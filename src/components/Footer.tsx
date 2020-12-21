import { FC } from 'react';
import styles from '~/styles/components/Footer.module.scss';

const Footer: FC = () => {
  return <div className={styles.wrap}>
    <a
      href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by{' '}
      <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
    </a>
  </div>;
};

export default Footer;
