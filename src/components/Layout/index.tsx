import type { FC } from 'react';
import { useMemo } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { PropsWithChildren } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  wrap: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
  },
  main: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  contents: {
    width: '100%',
    padding: '10px',
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const Layout: FC = ({ children }: PropsWithChildren<{}>) => {
  const classes = useStyles();

  return useMemo(() => <div className={classes.wrap}>
    <Header/>
    <Sidebar/>
    <main className={classes.main}>
      <div className={classes.contents}>
        {children}
      </div>
    </main>
    <Footer/>
  </div>, [classes, children]);
};

export default Layout;
