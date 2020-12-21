import type { FC } from 'react';
import { useDispatchContext } from '~/store';
import styles from '~/styles/components/Login.module.scss';

const Login: FC = () => {
  const { dispatch } = useDispatchContext();
  return <div className={styles.wrap}>
    Login
  </div>;
};

export default Login;
