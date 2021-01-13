import type { FC } from 'react';
import { useState, useCallback, useMemo } from 'react';
import { Input, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  id?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
  },
  input: {
    flexGrow: 1,
    marginTop: 16,
  },
  toggle: {
    marginLeft: '.5rem',
    alignSelf: 'center',
  },
});

const PasswordInput: FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const handleClick = useCallback(() => setShow(!show), [show]);

  return useMemo(() =>
    <div className={classes.wrap}>
      <Input
        className={classes.input}
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        {...props}
      />
      <div className={classes.toggle}>
        <Button size="small" onClick={handleClick} disabled={props.disabled} data-testid="password-switch">
          {show ? 'Hide' : 'Show'}
        </Button>
      </div>
    </div>, [show, props.value, props.disabled]);
};

export default PasswordInput;
