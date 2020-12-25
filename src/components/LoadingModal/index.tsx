import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Typography } from '@material-ui/core';
import CircleBar from './CircleBar';
import { useStoreContext } from '~/store';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.contrastText,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    userSelect: 'none',
  },
  typo: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.75rem',
    },
  },
}));

const LoadingModal = () => {
  const { loadingModal } = useStoreContext();
  const classes          = useStyles();

  return useMemo(() =>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={loadingModal.isOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 1000,
      }}
    >
      <Fade in={loadingModal.isOpen}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">{loadingModal.title}</h2>
          <pre>
            <Typography className={classes.typo}>{loadingModal.message}</Typography>
          </pre>
          <CircleBar/>
        </div>
      </Fade>
    </Modal>, [loadingModal],
  );
};

export default LoadingModal;
