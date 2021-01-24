import type { FC } from 'react';
import Login from '~/components/Login';
import { useStoreContext } from '~/store';
import useAuthToken from '~/hooks/useAuthToken';
import { addDisplayName } from '~/utils/component';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  wrap: {
    width: '100%',
  },
});

export type AuthenticatedPageProps = {
  authToken: string;
  authHeader: { authorization: string };
}

type Props = {
  page: string;
}

const AuthenticatedPage: (WrappedComponent: FC<AuthenticatedPageProps>) => FC<Props> = WrappedComponent => addDisplayName<FC<Props>>('AuthenticatedPage', props => {
  const classes = useStyles();
  const [auth] = useAuthToken();
  const { page, onRemoveToken, roles } = useStoreContext();

  return <div className={classes.wrap} data-testid={`page-${page}`}>
    {(!auth || onRemoveToken) && <Login {...props} />}
    {!(!auth || onRemoveToken) && !!roles && roles.includes(props.page) && <WrappedComponent {...auth} {...props} />}
  </div>;
}, WrappedComponent);

export default AuthenticatedPage;
