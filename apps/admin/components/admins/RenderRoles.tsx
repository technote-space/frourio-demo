import type { FC } from 'react';
import type { Model } from '~/components/DataTable';
import { useMemo } from 'react';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  chip: {
    margin: '2px 1px',
  },
});

type Props = {
  rowData: Partial<Model>;
};

const RenderRoles: FC<Props> = ({ rowData }: Props) => {
  const classes = useStyles();

  return useMemo(() => <div data-testid="render-roles">
    {rowData['roles'].map(role => <Chip key={role.role} className={classes.chip} color="primary" label={role.name}/>)}
  </div>, [classes, rowData['roles']]);
};

export default RenderRoles;
