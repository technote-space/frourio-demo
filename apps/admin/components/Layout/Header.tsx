import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Link } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Brightness4 from '@material-ui/icons/Brightness4';
import Brightness5 from '@material-ui/icons/Brightness5';
import useDarkMode from '~/hooks/useDarkMode';
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
    cursor: 'pointer',
    marginRight: theme.spacing(3),
    color: theme.palette.primary.contrastText,
  },
  grow: {
    flex: '1 1 auto',
  },
}));

const Header: FC = memo(() => {
  const classes = useStyles();
  const { dispatch } = useDispatchContext();
  const [themeColor, toggleDarkMode] = useDarkMode();
  const handleClickToggle = useCallback(() => openSidebar(dispatch), []);
  const handleClickHome = useCallback(() => changePage(dispatch, 'dashboard'), []);

  return <AppBar position="static" className={classes.root}>
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="menu"
        onClick={handleClickToggle}>
        <MenuIcon/>
      </IconButton>
      <Typography variant="h6" className={classes.title} onClick={handleClickHome}>
        予約システム
      </Typography>
      {process.env.FRONT_URL && /* istanbul ignore next */ <Link
        className={classes.title}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        href={process.env.FRONT_URL}
      >
        <Typography variant="h6">
          フロントページ
        </Typography>
      </Link>}
      {process.env.LOCK_URL && /* istanbul ignore next */ <Link
        className={classes.title}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        href={process.env.LOCK_URL}
      >
        <Typography variant="h6">
          部屋鍵
        </Typography>
      </Link>}
      <div className={classes.grow}/>
      <IconButton onClick={toggleDarkMode}>
        {themeColor === 'dark' ? <Brightness5/> : <Brightness4/>}
      </IconButton>
    </Toolbar>
  </AppBar>;
});

Header.displayName = 'Header';
export default Header;
