import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import clsx from 'clsx';
import { useStoreContext, useDispatchContext } from '~/store';
import pages, { PageKeys } from '~/_pages';
import { closeSidebar, changePage } from '~/utils/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    margin: '1rem',
  },
  avatar: {
    background: 'white',
    marginRight: '1rem',
  },
  item: {
    cursor: 'pointer',
    opacity: '0.6',
    '&:hover': {
      opacity: '0.9',
    },
  },
  active: {
    opacity: 1,
  },
});

const Sidebar: FC = () => {
  const classes = useStyles();
  const { isSidebarOpen, icon, name, page: _page } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const [{ authToken }] = useCookies(['authToken']);
  const onClose = useCallback(() => closeSidebar(dispatch), []);

  const MappedListItem: FC<{ slug: PageKeys, page: typeof pages[PageKeys] }> = ({ slug, page }) => {
    const handleClick = useCallback(() => {
      changePage(dispatch, slug);
      closeSidebar(dispatch);
    }, []);

    return useMemo(() => <ListItem
      key={slug}
      className={clsx(classes.item, slug === _page ? classes.active : '')}
      onClick={handleClick}
      data-testid={`menu-item-${slug}`}
    >
      <ListItemIcon>
        <page.icon/>
      </ListItemIcon>
      <ListItemText primary={page.label}/>
    </ListItem>, [_page, page.label]);
  };

  return useMemo(() =>
    <Drawer
      anchor='left'
      onClose={onClose}
      open={isSidebarOpen && !!authToken}
      ModalProps={{
        BackdropProps: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          'data-testid': 'drawer-layer',
        },
      }}
      PaperProps={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'data-testid': 'drawer-paper',
      }}
    >
      {(icon || name) && <>
        <div className={classes.drawerHeader}>
          {icon && <Avatar
            className={classes.avatar}
            src={icon}
            alt={name ?? 'admin'}
          />}
          {name}
        </div>
        <Divider/>
      </>}
      <List>
        {Object.entries(pages).map(([key, page]) =>
          <MappedListItem key={key} slug={key as PageKeys} page={page}/>)}
      </List>
    </Drawer>, [classes, isSidebarOpen, authToken, name, icon]);
};

export default Sidebar;
