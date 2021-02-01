import type { FC } from 'react';
import type { License } from '@frourio-demo/types';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  Link,
  IconButton,
  Typography,
  TextareaAutosize,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatchContext, useStoreContext } from '~/store';
import { closeLicense } from '~/utils/actions';
import { getLicenseList } from '~/utils/license';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    letterSpacing: '.1rem',
  },
  close: {
    position: 'fixed',
    zIndex: 1,
  },
  license: {
    width: '100%',
  },
  button: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(2, 0),
  },
  list: {
    position: 'relative',
  },
  listItem: {
    cursor: 'pointer',
    color: '#2d8fdd',
    borderLeft: 'solid 6px #2d8fdd',
    borderTop: 'solid 1px #dadada',
    borderBottom: 'solid 2px #dadada',
    borderRight: 'solid 1px #dadada',
    background: theme.palette.background.default,
    marginBottom: theme.spacing(1),
    lineHeight: 1.5,
    padding: '0.5rem',
    listStyle: 'none',
    fontWeight: 'bold',
  },
}));

const LicenseDialog: FC = memo(() => {
  const classes = useStyles();
  const { isLicenseOpen } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const licenses = useMemo(() => getLicenseList(), []);

  const handleCloseLicenseList = useCallback(() => {
    closeLicense(dispatch);
  }, []);
  const handleCloseLicense = useCallback(() => {
    setSelectIndex(-1);
  }, []);
  const MappedLicenseItem: FC<{ license: License; index: number; }> = memo(({ license, index }) => {
    const handleClick = useCallback(() => {
      setSelectIndex(index);
    }, []);

    return <ListItem className={classes.listItem} onClick={handleClick} data-testid="license-item">
      {license.name}@{license.version} : {license.licenses}
    </ListItem>;
  });
  MappedLicenseItem.displayName = 'MappedLicenseItem';

  useEffect(() => {
    if (!isLicenseOpen) {
      setSelectIndex(-1);
    }
  }, [isLicenseOpen]);

  return <>
    <Dialog open={isLicenseOpen} onClose={handleCloseLicenseList} fullScreen>
      <div data-testid="license-list">
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            ライセンス
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseLicenseList}
            className={classes.close}
            data-testid="close-license-list"
          >
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List className={classes.list}>
            {Object.entries(licenses).map(([key, license]) =>
              <MappedLicenseItem key={`license-${key}`} license={license} index={Number(key)}/>)}
          </List>
        </DialogContent>
      </div>
    </Dialog>
    <Dialog open={selectIndex >= 0} onClose={handleCloseLicense} fullWidth>
      {selectIndex >= 0 && <>
        <DialogTitle disableTypography className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            {licenses[selectIndex].name}@{licenses[selectIndex].version}<br/>
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseLicense}
            className={classes.close}
            data-testid="close-license"
          >
            <CloseIcon/>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextareaAutosize defaultValue={licenses[selectIndex].licenseText} readOnly className={classes.license}/>
          {licenses[selectIndex].repository && <div className={classes.button}>
            <Link target="_blank" rel="noopener noreferrer" href={licenses[selectIndex].repository} underline="none">
              <Button variant="contained" color="primary">
                Repository
              </Button>
            </Link>
          </div>}
        </DialogContent>
      </>}
    </Dialog>
  </>;
});

LicenseDialog.displayName = 'LicenseDialog';
export default LicenseDialog;
