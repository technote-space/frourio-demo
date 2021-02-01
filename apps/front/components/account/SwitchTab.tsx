import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { TabList, Tab } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link as RouterLink } from 'react-router-dom';

const SwitchTab: FC = memo(() => {
  const { logout } = useAuth0();
  const handleLogout = useCallback(() => {
    logout();
  }, []);

  return <TabList>
    <Tab as={RouterLink} to='/account'>会員情報</Tab>
    <Tab as={RouterLink} to='/reservations'>予約一覧</Tab>
    <Tab onClick={handleLogout}>ログアウト</Tab>
  </TabList>;
});

SwitchTab.displayName = 'SwitchTab';
export default SwitchTab;
