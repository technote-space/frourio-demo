import type { FC } from 'react';
import type { ValidationError } from 'class-validator';
import type { AuthenticatedPageProps } from '^/components/AuthenticatedPage';
import type { Guest } from '$/repositories/guest';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Heading, Box } from '@chakra-ui/react';
import { Grid, GridItem, Link, Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import useUnmountRef from '^/hooks/useUnmountRef';
import { useDispatchContext } from '^/store';
import AuthenticatedPage from '^/components/AuthenticatedPage';
import useFetch from '^/hooks/useFetch';
import { client, handleAuthError } from '^/utils/api';
import { setNotice } from '^/utils/actions';
import { isAxiosError } from '@frourio-demo/utils/api';

type EditGuest = {
  [key in keyof Guest]: key extends 'id' | 'createdAt' | 'updatedAt' ? never : Exclude<Guest[key], null>
};
const Account: FC<AuthenticatedPageProps> = ({ authHeader }: AuthenticatedPageProps) => {
  const unmountRef = useUnmountRef();
  const { logout } = useAuth0();
  const { dispatch } = useDispatchContext();
  const [edit, setEdit] = useState(false);
  const [editInfo, setEditInfo] = useState<EditGuest | undefined>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const guestInfo = useFetch(dispatch, {} as any, client.account.guest, {
    headers: authHeader,
  });
  const reservedReservation = useFetch(dispatch, [], client.account.reservations.reserved, {
    headers: authHeader,
  });
  const paidReservation = useFetch(dispatch, [], client.account.reservations.paid, {
    headers: authHeader,
  });
  const cancelledReservation = useFetch(dispatch, [], client.account.reservations.cancelled, {
    headers: authHeader,
  });
  const toggleEdit = useCallback(() => {
    setEdit(!edit);
    setValidationErrors({});
  }, [edit]);
  const handleSave = async() => {
    try {
      await handleAuthError(dispatch, undefined, client.account.guest.post, {
        headers: authHeader,
        body: editInfo!,
      });
      setNotice(dispatch, '更新しました。');
      await guestInfo?.revalidate();
      setEdit(false);
    } catch (error) {
      if (!unmountRef.current && isAxiosError(error) && error.response?.data) {
        const validationError = error.response.data as ValidationError[];
        setValidationErrors(Object.assign({}, ...validationError.map(error => error.constraints ? {
          [error.property]: Object.values(error.constraints)[0],
        } : undefined)));
      }
    }
  };

  useEffect(() => {
    if (guestInfo?.data) {
      setEditInfo(Object.assign({}, ...Object.entries(guestInfo.data).map(([key, value]) => ({ [key]: value ?? '' }))));
    }
  }, [guestInfo?.data, edit]);

  const fields = useMemo(() => [
    { name: 'email', label: 'メールアドレス' },
    { name: 'name', label: '名前' },
    { name: 'nameKana', label: 'かな名' },
    { name: 'zipCode', label: '郵便番号' },
    { name: 'address', label: '住所' },
    { name: 'phone', label: '電話番号' },
  ], []);
  const editButton = useMemo(() => <Link onClick={toggleEdit} float="right">{edit ? 'キャンセル' : '編集'}</Link>, [edit]);
  const InfoItem: FC<{ name: string; label: string }> = ({ name, label }) => <>
    <GridItem>{label}</GridItem>
    <GridItem>{guestInfo!.data![name]}</GridItem>
  </>;
  const guestInfoView = useMemo(() => guestInfo?.data ? <Grid templateColumns="repeat(2, 1fr)" gap={4}>
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      {fields.slice(0, fields.length / 2).map(field =>
        <InfoItem key={`group-${field.name}`} name={field.name} label={field.label}/>)}
    </Grid>
    <Grid templateColumns="repeat(2, 1fr)" gap={5}>
      {fields.slice(fields.length / 2).map(field =>
        <InfoItem key={`group-${field.name}`} name={field.name} label={field.label}/>)}
    </Grid>
  </Grid> : null, [guestInfo?.data]);
  const handleEditChange = (name: string) => event => {
    setEditInfo({
      ...editInfo!,
      [name]: event.target.value,
    });
    if (validationErrors[name]) {
      delete validationErrors[name];
      setValidationErrors(validationErrors);
    }
  };
  const guestInfoEditView = editInfo ? <Box>
    {fields.map(field => <FormControl
      key={`edit-${field.name}`}
      id={`edit-${field.name}`}
      isInvalid={!!validationErrors[field.name]}
      isRequired
      mb={3}
    >
      <FormLabel htmlFor={`edit-${field.name}`}>{field.label}</FormLabel>
      <Input
        key={`input-value-${field.name}`}
        value={editInfo ? editInfo[field.name] : ''}
        onChange={handleEditChange(field.name)}
      />
      <FormErrorMessage>{validationErrors[field.name]}</FormErrorMessage>
    </FormControl>)}
    <Box colSpan={3} textAlign="center">
      <Button width={120} m={2} colorScheme="teal" onClick={handleSave}>保存</Button>
      <Button width={120} m={2} colorScheme="red" onClick={toggleEdit}>キャンセル</Button>
    </Box>
  </Box> : null;

  return <Tabs>
    <TabList>
      <Tab>会員情報</Tab>
      <Tab>予約一覧</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <Heading as="h4" size="md" mb={4} display="inline-block">会員情報</Heading>
        {editButton}
        {edit && guestInfoEditView}
        {!edit && guestInfoView}
      </TabPanel>
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
              <p>０件</p>
            </TabPanel>
            <TabPanel>
              <p>０件</p>
            </TabPanel>
            <TabPanel>
              <p>０件</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </TabPanel>
    </TabPanels>
  </Tabs>;
};

export default AuthenticatedPage(Account);
