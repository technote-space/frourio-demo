import type { FC } from 'react';
import type { AuthenticatedPageProps } from '^/components/AuthenticatedPage';
import { memo, useState, useCallback } from 'react';
import { Tabs, TabPanels, TabPanel, Heading, Link } from '@chakra-ui/react';
import AuthenticatedPage from '^/components/AuthenticatedPage';
import Detail from '^/components/account/Detail';
import Edit from '^/components/account/Edit';
import SwitchTab from '^/components/account/SwitchTab';

const Account: FC<AuthenticatedPageProps> = memo(({ authHeader }: AuthenticatedPageProps) => {
  const [edit, setEdit] = useState(false);
  const toggleEdit = useCallback(() => {
    setEdit(!edit);
  }, [edit]);

  return <Tabs defaultIndex={0} m={4}>
    <SwitchTab/>
    <TabPanels>
      <TabPanel>
        <Heading as="h4" size="md" mb={4} display="inline-block">会員情報</Heading>
        <Link onClick={toggleEdit} float="right">{edit ? 'キャンセル' : '編集'}</Link>
        {edit && <Edit authHeader={authHeader} setEdit={setEdit}/>}
        {!edit && <Detail authHeader={authHeader}/>}
      </TabPanel>
      <TabPanel/>
    </TabPanels>
  </Tabs>;
});

Account.displayName = 'Account';
export default AuthenticatedPage(Account);
