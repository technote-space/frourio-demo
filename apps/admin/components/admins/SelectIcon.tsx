import type { FC, ChangeEvent } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { Avatar, Button } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  input: {
    display: 'none',
  },
  avatar: {
    background: 'white',
    margin: 'auto',
    marginBottom: '3px',
  },
});

type Props = {
  props: EditComponentPropsWithError<Model>;
};

const SelectIcon: FC<Props> = ({ props }: Props) => {
  const classes = useStyles();
  const [preview, setPreview] = useState<string | undefined>();
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.files![0]);
  }, []);

  useEffect(() => {
    if (props.value) {
      if (typeof props.value === 'string') {
        setPreview(props.value);
      } else {
        setPreview(URL.createObjectURL(props.value));
      }
    }
  }, [props.value]);

  return useMemo(() => <div>
    {preview && <Avatar
      className={classes.avatar}
      src={preview}
      alt={'selected icon'}
    />}
    <input
      accept="image/*"
      className={classes.input}
      type="file"
      id="select-icon-file"
      onChange={handleChange}
      data-testid="select-icon-file"
    />
    <label htmlFor="select-icon-file">
      <Button
        variant="contained"
        color="primary"
        component="span"
        startIcon={<CloudUploadIcon/>}
      >
        選択
      </Button>
    </label>
  </div>, [classes, preview]);
};

export default SelectIcon;
