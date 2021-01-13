import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Brightness4 from '@material-ui/icons/Brightness4';
import Brightness5 from '@material-ui/icons/Brightness5';
import { useCookies } from 'react-cookie';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { addDays } from 'date-fns';
import { useDispatchContext } from '~/store';
import { openSidebar, changePage } from '~/utils/actions';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  grow: {
    flex: '1 1 auto',
  },
}));

const Header: FC = () => {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { dispatch } = useDispatchContext();
  const [{ authToken, themeColor }, setCookie] = useCookies(['authToken', 'themeColor']);
  const handleClickToggle = useCallback(() => openSidebar(dispatch), []);
  const handleClickHome = useCallback(() => changePage(dispatch, 'dashboard'), []);
  const handleToggleDarkMode = useCallback(() => {
    setCookie('themeColor', (themeColor && themeColor === 'dark') || (!themeColor && prefersDarkMode) ? 'light' : 'dark', {
      expires: addDays(new Date(), 365),
    });
  }, [prefersDarkMode, themeColor]);

  return useMemo(() =>
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        {authToken && <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={handleClickToggle}>
          <MenuIcon/>
        </IconButton>}
        <Typography variant="h6" className={classes.title} onClick={handleClickHome}>
          予約システム
        </Typography>
        <div className={classes.grow}/>
        <IconButton onClick={handleToggleDarkMode}>
          {themeColor === 'dark' ? <Brightness5/> : <Brightness4/>}
        </IconButton>
      </Toolbar>
    </AppBar>, [classes, authToken, themeColor]);
};

export default Header;
