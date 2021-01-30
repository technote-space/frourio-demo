import type { FC } from 'react';
import type { AuthenticatedPageProps } from '^/components/AuthenticatedPage';
import { useMemo } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Heading } from '@chakra-ui/react';
import AuthenticatedPage from '^/components/AuthenticatedPage';
import { client } from '^/utils/api';
import Reservations from '^/components/account/Reservations';
import SwitchTab from '^/components/account/SwitchTab';

const Account: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  return useMemo(() => <Tabs defaultIndex={1} m={4}>
    <SwitchTab/>
    <TabPanels>
      <TabPanel/>
      <TabPanel>
        <Heading as="h4" size="md" mb={2}>予約一覧</Heading>
        <Tabs>
          <TabList>
            <Tab>予約中</Tab>
            <Tab>宿泊済み</Tab>
            <Tab>キャンセル済み</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Reservations api={client.account.reservations.reserved} options={[{ headers: authHeader }]}/>
            </TabPanel>
            <TabPanel>
              <Reservations api={client.account.reservations.paid} options={[{ headers: authHeader }]}/>
            </TabPanel>
            <TabPanel>
              <Reservations api={client.account.reservations.cancelled} options={[{ headers: authHeader }]}/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </TabPanel>
    </TabPanels>
  </Tabs>, []);
};

export default AuthenticatedPage(Account);
