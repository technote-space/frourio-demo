import type { FC } from 'react';
import { useCallback, useMemo } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
} from '@chakra-ui/react';
import { List, ListItem, ListIcon, Divider, Flex, Text } from '@chakra-ui/react';
import { useCookies } from 'react-cookie';
import clsx from 'clsx';
import { useStoreContext, useDispatchContext } from '~/store';
import pages, { PageKeys } from '~/_pages';
import styles from '~/styles/components/Sidebar.module.scss';

const Sidebar: FC = () => {
  const { isSidebarOpen, icon, name, page: _page } = useStoreContext();
  const { dispatch }                               = useDispatchContext();
  const [{ authToken }]                            = useCookies(['authToken']);
  const onClose                                    = useCallback(() => dispatch({ type: 'CLOSE_SIDEBAR' }), []);

  const MappedListItem: FC<{ slug: string, page: typeof pages[PageKeys] }> = ({ slug, page }) => {
    const handleClick = useCallback(() => {
      dispatch({ type: 'PAGE', page: slug });
      dispatch({ type: 'CLOSE_SIDEBAR' });
    }, []);

    return useMemo(() => <ListItem
      key={slug}
      className={clsx(styles.item, slug === _page ? styles.active : '')}
      onClick={handleClick}
      bg="teal.500"
      p={3}
    >
      <Flex fontSize="lg" alignItems="center">
        <ListIcon as={page.icon} color="green.500"/>
        <Text variant="span" ml={2}>{page.label}</Text>
      </Flex>
    </ListItem>, [_page, page.label]);
  };

  return useMemo(() =>
    <Drawer placement='left' onClose={onClose} isOpen={isSidebarOpen && !!authToken}>
      <DrawerOverlay>
        <DrawerContent
          bg="teal.500"
          color="white"
        >
          <DrawerCloseButton/>
          {(icon || name) && <>
            <DrawerHeader>
              {icon && <Image
                borderRadius="full"
                boxSize="150px"
                src={icon}
                alt={name ?? 'admin'}
              />}
              {name}
            </DrawerHeader>
            <Divider/>
          </>}
          <DrawerBody>
            <List spacing={1}>
              {Object.entries(pages).map(([key, page]) => <MappedListItem key={key} slug={key} page={page}/>)}
            </List>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>, [isSidebarOpen, authToken, name, icon]);
};

export default Sidebar;
