import type { FC } from 'react';
import type { ReservationData } from './index';
import type { CreateReservationBody } from '$/domains/front/reservation/validators';
import { memo, useState, useCallback, useEffect } from 'react';
import { Box, Input, Heading, Checkbox, Center, Button } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { startWithUppercase } from '@frourio-demo/utils/string';
import { useStoreContext } from '^/store';
import useAuthToken from '^/hooks/useAuthToken';
import useUnmountRef from '^/hooks/useUnmountRef';
import { client, processValidationError } from '^/utils/api';
import { getAddress } from '^/utils/zipCode';
import { ACCOUNT_FIELDS } from '^/utils/constants';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';

type Props = {
  reservation: ReservationData;
  onChangeName: (name: string) => void;
  onChangeNameKana: (name: string) => void;
  onChangeZipCode: (zipcode: string) => void;
  onChangeAddress: (address: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeUpdateInfo: () => void;
  onConfirm: () => void;
  onDetail: () => void;
}

const GuestInfo: FC<Props> = memo((props: Props) => {
  const { reservation, onConfirm, onDetail } = props;
  const unmountRef = useUnmountRef();
  const { guest } = useStoreContext();
  const [auth] = useAuthToken();
  const [isConfirming, setIsConfirming] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const handleClickConfirm = useCallback(async() => {
    setIsConfirming(true);
    try {
      await client.reservation.validate.post({
        body: reservation as CreateReservationBody,
        ...(auth ? {
          headers: auth.authHeader,
        } : {}),
      });
      onConfirm();
    } catch (error) {
      if (!unmountRef.current) {
        setValidationErrors(processValidationError(error));
      }
    } finally {
      if (!unmountRef.current) {
        setIsConfirming(false);
      }
    }
  }, [reservation]);
  const getGuestKey = (name: string): string => `guest${startWithUppercase(name)}`;
  const isValidGuest = !RESERVATION_GUEST_FIELDS.some(field => !reservation[getGuestKey(field)]);
  const hasEmptyField = !guest || RESERVATION_GUEST_FIELDS.some(field => !guest[field]);

  const handleEditChange = (name: string) => event => {
    props[`onChange${startWithUppercase(name)}`](event.target.value);
    if (validationErrors[getGuestKey(name)]) {
      delete validationErrors[getGuestKey(name)];
      setValidationErrors(validationErrors);
    }
  };

  useEffect(() => {
    getAddress(reservation.guestZipCode).then(address => {
      if (!unmountRef.current && address) {
        props.onChangeAddress(`${address.prefecture_name}${address.city_name}${address.town_name}`);
      }
    });
  }, [reservation.guestZipCode]);
  useEffect(() => {
    if (hasEmptyField && !reservation.updateInfo) {
      props.onChangeUpdateInfo();
    }
  }, [hasEmptyField, reservation.updateInfo]);

  return <Box
    shadow="md"
    p={[1, 2, 4]}
    m="2"
    borderWidth={1}
    display={['flex', 'flex', 'inline-block']}
    flexDirection='column'
    minW={['none', 'none', 400]}
  >
    <Heading as="h4" size="lg">ご予約</Heading>
    <Box m={1} p={2} height="100%">
      <Heading as="h4" size="md">お客様情報</Heading>
      {ACCOUNT_FIELDS.filter(field => field.name !== 'email').map(field => {
        return <FormControl
          key={field.name}
          id={`edit-${field.name}`}
          isInvalid={!!validationErrors[getGuestKey(field.name)]}
          isRequired
          mb={2}
        >
          <FormLabel htmlFor={`edit-${field.name}`}>{field.label}</FormLabel>
          <Input
            value={reservation[getGuestKey(field.name)]}
            onChange={handleEditChange(field.name)}
          />
          <FormErrorMessage>{validationErrors[getGuestKey(field.name)]}</FormErrorMessage>
        </FormControl>;
      })}
      {!hasEmptyField && <Checkbox my={2} isChecked={reservation.updateInfo} onChange={handleEditChange('updateInfo')}>
        お客様の登録情報を更新する
      </Checkbox>}
    </Box>
    <Center>
      <Button m={1} onClick={handleClickConfirm} disabled={!isValidGuest || isConfirming}>
        確認
      </Button>
      <Button m={1} colorScheme="red" onClick={onDetail} disabled={isConfirming}>
        戻る
      </Button>
    </Center>
  </Box>;
});

GuestInfo.displayName = 'GuestInfo';
export default GuestInfo;
