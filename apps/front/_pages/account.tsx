import type { FC } from 'react';
import type { AuthenticatedPageProps } from '^/components/AuthenticatedPage';
import { useMemo, useState, useCallback } from 'react';
import { Tabs, TabPanels, TabPanel, Heading, Link } from '@chakra-ui/react';
import AuthenticatedPage from '^/components/AuthenticatedPage';
import Detail from '^/components/account/Detail';
import Edit from '^/components/account/Edit';
import SwitchTab from '^/components/account/SwitchTab';

const Account: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const [edit, setEdit] = useState(false);
  const toggleEdit = useCallback(() => {
    setEdit(!edit);
  }, [edit]);
  const editButton = useMemo(() => <Link onClick={toggleEdit} float="right">{edit ? 'キャンセル' : '編集'}</Link>, [edit]);

  return <Tabs defaultIndex={0}>
    <SwitchTab/>
    <TabPanels>
      <TabPanel>
        <Heading as="h4" size="md" mb={4} display="inline-block">会員情報</Heading>
        {editButton}
        {edit && <Edit authHeader={authHeader} setEdit={setEdit}/>}
        {!edit && <Detail authHeader={authHeader}/>}
      </TabPanel>
      <TabPanel/>
    </TabPanels>
  </Tabs>;
};

export default AuthenticatedPage(Account);
