import type { FC } from 'react';
import type { AuthHeader } from '@frourio-demo/types';
import type { Guest } from '$/packages/domain/database/guest';
import { memo, useState, useEffect, useCallback } from 'react';
import { Box, Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import useUnmountRef from '^/hooks/useUnmountRef';
import { useDispatchContext } from '^/store';
import useFetch from '^/hooks/useFetch';
import { client, handleAuthError, processValidationError } from '^/utils/api';
import { setNotice } from '^/utils/actions';
import { getAddress } from '^/utils/zipCode';
import { ACCOUNT_FIELDS } from '@frourio-demo/constants';

type EditGuest = {
  [key in keyof Guest]: key extends 'id' | 'createdAt' | 'updatedAt' ? never : Exclude<Guest[key], null>
};
type Props = {
  authHeader: AuthHeader;
  setEdit: (flag: boolean) => void;
}

const Edit: FC<Props> = memo(({ authHeader, setEdit }: Props) => {
  const unmountRef = useUnmountRef();
  const { dispatch } = useDispatchContext();
  const [editInfo, setEditInfo] = useState<EditGuest | undefined>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const guestInfo = useFetch(dispatch, {}, client.account.guest, {
    headers: authHeader,
  });

  useEffect(() => {
    if (guestInfo.data) {
      setEditInfo(Object.assign({}, ...Object.entries(guestInfo.data).map(([key, value]) => ({ [key]: value ?? '' }))));
    }
  }, [guestInfo.data]);
  useEffect(() => {
    if (!editInfo?.address) {
      getAddress(editInfo?.zipCode).then(address => {
        if (!unmountRef.current && address) {
          setEditInfo({
            ...editInfo!,
            address: `${address.prefecture_name}${address.city_name}${address.town_name}`,
          });
        }
      });
    }
  }, [editInfo?.zipCode]);

  const handleSave = useCallback(async() => {
    try {
      await handleAuthError(dispatch, undefined, client.account.guest.patch, {
        headers: authHeader,
        body: editInfo!,
      });
      setNotice(dispatch, '更新しました。');
      await guestInfo.revalidate();
      handleClose();
    } catch (error) {
      if (!unmountRef.current) {
        setValidationErrors(processValidationError(error));
      }
    }
  }, [editInfo]);
  const handleClose = useCallback(() => {
    setEdit(false);
  }, []);
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
  return editInfo ? <Box>
    {ACCOUNT_FIELDS.map(field => <FormControl
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
      <Button m={2} onClick={handleSave}>保存</Button>
      <Button m={2} colorScheme="red" onClick={handleClose}>キャンセル</Button>
    </Box>
  </Box> : null;
});

Edit.displayName = 'Edit';
export default Edit;
