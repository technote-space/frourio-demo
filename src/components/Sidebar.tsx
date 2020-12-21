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
import { useStoreContext, useDispatchContext } from '~/store';
import styles from '~/styles/components/Sidebar.module.scss';

const Sidebar: FC = () => {
  const { isSidebarOpen, authToken, icon, name } = useStoreContext();
  const { dispatch }                             = useDispatchContext();
  const onClose                                  = useCallback(() => dispatch({ type: 'CLOSE_SIDEBAR' }), []);

  return useMemo(() =>
    <Drawer placement='left' onClose={onClose} isOpen={isSidebarOpen && !!authToken}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton/>
          {icon && <DrawerHeader>
            <Image
              borderRadius="full"
              boxSize="150px"
              src={icon}
              alt={name ?? 'admin'}
            />
            {name}
          </DrawerHeader>}
          <DrawerBody>
            <p>ダッシュボード</p>
            <p>部屋</p>
            <p>利用者</p>
            <p>予約</p>
            <p>ログアウト</p>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>, [isSidebarOpen, authToken, name, icon]);
};

export default Sidebar;
