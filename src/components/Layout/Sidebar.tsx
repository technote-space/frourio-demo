import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import { Drawer, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import clsx from 'clsx';
import { useStoreContext, useDispatchContext } from '~/store';
import pages, { PageKeys } from '~/_pages';
import { closeSidebar, changePage } from '~/utils/actions';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
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
}));

const Sidebar: FC = () => {
  const classes                                    = useStyles();
  const { isSidebarOpen, icon, name, page: _page } = useStoreContext();
  const { dispatch }                               = useDispatchContext();
  const [{ authToken }]                            = useCookies(['authToken']);
  const onClose                                    = useCallback(() => closeSidebar(dispatch), []);

  const MappedListItem: FC<{ slug: PageKeys, page: typeof pages[PageKeys] }> = ({ slug, page }) => {
    const handleClick = useCallback(() => {
      changePage(dispatch, slug);
      closeSidebar(dispatch);
    }, []);

    return useMemo(() => <ListItem
      key={slug}
      className={clsx(classes.item, slug === _page ? classes.active : '')}
      onClick={handleClick}
    >
      <ListItemIcon>
        <page.icon/>
      </ListItemIcon>
      <ListItemText primary={page.label}/>
    </ListItem>, [_page, page.label]);
  };

  return useMemo(() =>
    <Drawer anchor='left' onClose={onClose} open={isSidebarOpen && !!authToken}>
      {(icon || name) && <>
        {icon && <Avatar
          src={icon}
          alt={name ?? 'admin'}
        />}
        {name}
        <Divider/>
      </>}
      <List>
        {Object.entries(pages).map(([key, page]) =>
          <MappedListItem key={key} slug={key as PageKeys} page={page}/>)}
      </List>
    </Drawer>, [isSidebarOpen, authToken, name, icon]);
};

export default Sidebar;
