import type { FC } from 'react';
import { useMemo } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

const CircleBar: FC = () => {
  const classes = useStyles();

  return useMemo(() =>
    <div className={classes.root}>
      <CircularProgress/>
    </div>, [classes],
  );
};

export default CircleBar;
