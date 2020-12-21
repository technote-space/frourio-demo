import { FC } from 'react';
import CommonPage from '~/components/CommonPage';
import styles from '~/styles/pages/Login.module.scss';

const Login: FC = () => {
  return <div className={styles.wrap}>
    Login
  </div>;
};

export default CommonPage(Login);
