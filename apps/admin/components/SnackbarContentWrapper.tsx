import type { FC, MouseEventHandler } from 'react';
import clsx from 'clsx';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type Props = {
  className: string;
  message: string;
  onClose: MouseEventHandler;
  variant: 'error' | 'info' | 'success' | 'warning';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  other?: any
}

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    // eslint-disable-next-line no-magic-numbers
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const SnackbarContentWrapper: FC<Props> = ({ className, message, onClose, variant, ...other }: Props) => {
  const Icon = variantIcon[variant];
  const classes = useStyles();

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)}/>
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon}/>
        </IconButton>,
      ]}
      {...other}
    />
  );
};

export default SnackbarContentWrapper;
