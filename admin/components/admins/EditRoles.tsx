import type { FC, ChangeEvent } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo, useCallback, useEffect } from 'react';
import { Chip, Select, MenuItem, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  select: {
    minWidth: 100,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
});

type Props = {
  props: EditComponentPropsWithError<Model>;
  roles: Record<string, string>;
};

const EditRoles: FC<Props> = ({ props, roles }: Props) => {
  const classes = useStyles();
  const handleChange = useCallback((event: ChangeEvent<{ value: string[] }>) => {
    props.onChange(event.target.value.map(role => JSON.stringify({ role, name: roles[role] })));
  }, [roles]);

  const isNotProcessed = props.value && typeof props.value[0] === 'object';
  useEffect(() => {
    if (isNotProcessed) {
      props.onChange(props.value.map(role => JSON.stringify(role)));
    }
  }, [isNotProcessed]);

  return useMemo(() => isNotProcessed ? null : <div data-testid="edit-roles">
    <Select
      multiple
      className={classes.select}
      value={(props.value ?? []).map((role: string) => JSON.parse(role).role)}
      onChange={handleChange}
      input={<Input/>}
      renderValue={(selected) => <div className={classes.chips}>
        {(selected as string[]).map(role => <Chip
          key={`chip-${role}`}
          label={roles[role]}
          className={classes.chip}
        />)}
      </div>}
    >
      {Object.entries(roles).map(([role, name]) => <MenuItem key={`menu-item-${role}`} value={role}>
        {name}
      </MenuItem>)}
    </Select>
  </div>, [classes, props.value, roles]);
};

export default EditRoles;
