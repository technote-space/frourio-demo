import type { FC } from 'react';
import { memo } from 'react';
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

const Footer: FC = memo(() => {
  const classes = useStyles();

  return <footer className={classes.footer}>
    <div className={classes.wrap}>
      {(new Date()).getFullYear()} — <strong>予約システム</strong>
    </div>
  </footer>;
});

Footer.displayName = 'Footer';
export default Footer;
