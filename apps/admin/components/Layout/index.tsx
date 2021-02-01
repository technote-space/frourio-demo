import type { FC } from 'react';
import { memo } from 'react';
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
    margin: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const Layout: FC = memo(({ children }: PropsWithChildren<{}>) => {
  const classes = useStyles();

  return <div className={classes.wrap}>
    <Header/>
    <Sidebar/>
    <main className={classes.main}>
      <div className={classes.contents}>
        {children}
      </div>
    </main>
    <Footer/>
  </div>;
});

Layout.displayName = 'Layout';
export default Layout;
