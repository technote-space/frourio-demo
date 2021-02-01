import type { FC } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { AuthHeader } from '@frourio-demo/types';
import { useMemo, useCallback, useEffect } from 'react';
import { FormControl, FormHelperText, TextField } from '@material-ui/core';
import useFetch from '~/hooks/useFetch';
import { client } from '~/utils/api';
import { useDispatchContext } from '~/store';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  authHeader: AuthHeader;
  props: EditComponentPropsWithError<Model>;
}

const useStyles = makeStyles({
  input: {
    float: 'right',
  },
});

const InputNumber: FC<Props> = ({ authHeader, props }: Props) => {
  const classes = useStyles();
  const { dispatch } = useDispatchContext();
  const room = useFetch(dispatch, undefined, client.reservations.room, {
    headers: authHeader,
    query: { roomId: Number(props.rowData['roomId']) },
    enabled: !!props.rowData['roomId'],
  });
  const handleChange = useCallback(event => {
    props.onChange(Number(event.target.value));
  }, []);
  useEffect(() => {
    if (room.data && (!props.value || props.value > room.data.number)) {
      props.onChange(room.data.number);
    }
  }, [room.data, props.value]);

  return useMemo(() => room.data && props.value ? <FormControl error={Boolean(props.error)}>
    <TextField
      className={classes.input}
      fullWidth
      type="number"
      placeholder="人数"
      value={props.value}
      onChange={handleChange}
      InputProps={{
        style: { fontSize: 13 },
      }}
      inputProps={{
        'aria-label': '人数',
        min: 1,
        max: room.data.number,
      }}
      data-testid="input-number"
    />
    {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
  </FormControl> : null, [room.data, props.value]);
};

export default InputNumber;
