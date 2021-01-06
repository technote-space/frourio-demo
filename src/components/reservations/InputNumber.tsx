import type { FC } from 'react';
import { useMemo, useCallback, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import useFetch from '~/hooks/useFetch';
import { client } from '~/utils/api';
import { useDispatchContext } from '~/store';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  authHeader: { authorization: string };
  roomId?: number;
  value?: number;
  onChange: ((value: any) => void);
}

const useStyles = makeStyles({
  input: {
    float: 'right',
  },
});

const InputNumber: FC<Props> = ({ authHeader, roomId, value, onChange }: Props) => {
  const classes      = useStyles();
  const { dispatch } = useDispatchContext();
  const room         = useFetch(dispatch, undefined, client.reservations.room, {
    headers: authHeader,
    query: { roomId: Number(roomId) },
    enabled: !!roomId,
  });
  const handleChange = useCallback(event => {
    onChange(Number(event.target.value));
  }, [onChange]);
  useEffect(() => {
    if (room?.data && (!value || value > room.data.number)) {
      onChange(room.data.number);
    }
  }, [room?.data, value]);

  return useMemo(() => room?.data && value ? <TextField
    className={classes.input}
    fullWidth
    type="number"
    placeholder="人数"
    value={value}
    onChange={handleChange}
    InputProps={{
      style: { fontSize: 13 },
    }}
    inputProps={{
      'aria-label': '人数',
      min: 1,
      max: room.data.number,
    }}
  /> : null, [room?.data, value]);
};

export default InputNumber;
