import type { FC } from 'react';
import { memo, useCallback } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import { useDispatchContext, useStoreContext } from '~/store';
import { closeNotice } from '~/utils/actions';

const useStyles = makeStyles(() => createStyles({
  snackbar: {},
  content: {},
}));

const SnackbarWrapper: FC = memo(() => {
  const { notice } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const classes = useStyles();

  const handleClose = useCallback((): void => {
    closeNotice(dispatch);
  }, []);

  return notice.message ? <Snackbar
    className={classes.content}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    open={notice.open}
    autoHideDuration={6000}
    onClose={handleClose}
  >
    <SnackbarContentWrapper
      className={classes.content}
      message={notice.message}
      onClose={handleClose}
      variant={notice.variant}
    />
  </Snackbar> : null;
});

SnackbarWrapper.displayName = 'SnackbarWrapper';
export default SnackbarWrapper;
