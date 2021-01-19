import type { FC } from 'react';
import type { Page, Menu } from '~/types';
import { useCallback, useMemo } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@material-ui/core';
import clsx from 'clsx';
import useAuthToken from '~/hooks/useAuthToken';
import { useStoreContext, useDispatchContext } from '~/store';
import pages, { menus, PageKeys, MenuKeys } from '~/_pages';
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
  const [auth, , removeToken] = useAuthToken();
  const onClose = useCallback(() => closeSidebar(dispatch), []);

  const MappedPageItem: FC<{ slug: PageKeys, page: Page }> = ({ slug, page }) => {
    const handleClick = useCallback(() => {
      changePage(dispatch, slug);
      closeSidebar(dispatch);
    }, []);

    return useMemo(() => <ListItem
      key={slug}
      className={clsx(classes.item, slug === _page ? classes.active : '')}
      onClick={handleClick}
      data-testid={`page-item-${slug}`}
    >
      <ListItemIcon>
        <page.icon/>
      </ListItemIcon>
      <ListItemText primary={page.label}/>
    </ListItem>, [_page, page.label]);
  };
  const MappedMenuItem: FC<{ slug: MenuKeys, menu: Menu }> = ({ slug, menu }) => {
    const handleClick = useCallback(() => {
      menu.onClick({ dispatch, removeToken });
      closeSidebar(dispatch);
    }, []);

    return useMemo(() => <ListItem
      key={slug}
      className={classes.item}
      onClick={handleClick}
      data-testid={`menu-item-${slug}`}
    >
      <ListItemIcon>
        <menu.icon/>
      </ListItemIcon>
      <ListItemText primary={menu.label}/>
    </ListItem>, [menu.label]);
  };

  return useMemo(() =>
    <Drawer
      anchor='left'
      onClose={onClose}
      open={isSidebarOpen}
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
            data-testid="admin-avatar"
          />}
          {name}
        </div>
        <Divider/>
      </>}
      {auth && <List>
        {Object.entries(pages).map(([key, page]) =>
          <MappedPageItem key={`page-${key}`} slug={key as PageKeys} page={page}/>)}
      </List>}
      <Divider/>
      <List>
        {Object.entries(menus).map(([key, menu]) =>
          auth || menu.always ? <MappedMenuItem key={`menu-${key}`} slug={key as PageKeys} menu={menu}/> : null)}
      </List>
    </Drawer>, [classes, isSidebarOpen, auth, name, icon]);
};

export default Sidebar;
