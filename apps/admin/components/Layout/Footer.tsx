import type { FC } from 'react';
import { useMemo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  footer: {
    width: '100%',
  },
  wrap: {
    display: 'flex',
    padding: '1rem',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const Footer: FC = () => {
  const classes = useStyles();

  return useMemo(() => <footer className={classes.footer}>
    <div className={classes.wrap}>
      {(new Date()).getFullYear()} — <strong>予約システム</strong>
    </div>
  </footer>, [classes]);
};

export default Footer;
