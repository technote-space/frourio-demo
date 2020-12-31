import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useCookies } from 'react-cookie';
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
}));

const Header: FC = () => {
  const classes           = useStyles();
  const { dispatch }      = useDispatchContext();
  const [{ authToken }]   = useCookies(['authToken']);
  const handleClickToggle = useCallback(() => openSidebar(dispatch), []);
  const handleClickHome   = useCallback(() => changePage(dispatch, 'dashboard'), []);

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
      </Toolbar>
    </AppBar>, [classes, authToken]);
};

export default Header;
