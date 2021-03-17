import type { FC } from 'react';
import type { ReservationData } from './index';
import type { CreateReservationBody } from '$/packages/application/usecase/front/reservation/validators';
import { memo, useState, useCallback, useEffect } from 'react';
import { Box, Input, Heading, Checkbox, Center, Button } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { startWithUppercase } from '@frourio-demo/utils/string';
import { useStoreContext, useDispatchContext } from '^/store';
import useAuthToken from '^/hooks/useAuthToken';
import useUnmountRef from '@technote-space/use-unmount-ref';
import { client, processValidationError } from '^/utils/api';
import { getAddress } from '@technote-space/zipcode2address-jp';
import { setError } from '^/utils/actions';
import { ACCOUNT_FIELDS } from '@frourio-demo/constants';
import { RESERVATION_GUEST_FIELDS } from '@frourio-demo/constants';

type Props = {
  hidden: boolean;
  reservation: ReservationData;
  onChangeEmail: (email: string) => void;
  onChangeName: (name: string) => void;
  onChangeNameKana: (name: string) => void;
  onChangeZipCode: (zipcode: string) => void;
  onChangeAddress: (address: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeUpdateInfo: () => void;
  onPayment: () => void;
  onDetail: () => void;
}

const GuestInfo: FC<Props> = memo((props: Props) => {
  const { reservation, onPayment, onDetail } = props;
  const unmountRef = useUnmountRef();
  const { guest } = useStoreContext();
  const [auth] = useAuthToken();
  const { dispatch } = useDispatchContext();
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
      onPayment();
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
  const willChangeInfo = !hasEmptyField && RESERVATION_GUEST_FIELDS.some(field => guest![field] !== (reservation[getGuestKey(field)] ?? ''));

  const handleEditChange = (name: string) => event => {
    props[`onChange${startWithUppercase(name)}`](event.target.value);
    if (validationErrors[getGuestKey(name)]) {
      delete validationErrors[getGuestKey(name)];
      setValidationErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (!reservation.guestAddress) {
      getAddress(reservation.guestZipCode).then(address => {
        if (!unmountRef.current && address) {
          props.onChangeAddress(`${address.prefectureName}${address.cityName}${address.townName}`);
        }
      });
    }
  }, [reservation.guestZipCode]);
  useEffect(() => {
    if (hasEmptyField && !reservation.updateInfo) {
      props.onChangeUpdateInfo();
    }
  }, [hasEmptyField, reservation.updateInfo]);
  useEffect(() => {
    const keys = ACCOUNT_FIELDS.map(field => getGuestKey(field.name));
    Object.keys(validationErrors).filter(key => !keys.includes(key)).forEach(key => {
      setError(dispatch, validationErrors[key]);
    });
  }, [validationErrors]);

  return <Box
    shadow="md"
    p={[1, 2, 4]}
    m="2"
    borderWidth={1}
    display={props.hidden ? 'none' : ['flex', 'flex', 'inline-block']}
    flexDirection='column'
    minW={['none', 'none', 400]}
  >
    <Heading as="h4" size="lg">ご予約</Heading>
    <Box m={1} p={2} height="100%">
      <Heading as="h4" size="md">お客様情報</Heading>
      {ACCOUNT_FIELDS.filter(field => !guest || field.name !== 'email').map(field => {
        return <FormControl
          key={field.name}
          id={`edit-${field.name}`}
          isInvalid={!!validationErrors[getGuestKey(field.name)]}
          isRequired
          isDisabled={isConfirming}
          mt={1}
          mb={3}
        >
          <FormLabel htmlFor={`edit-${field.name}`}>{field.label}</FormLabel>
          <Input
            value={reservation[getGuestKey(field.name)] ?? ''}
            onChange={handleEditChange(field.name)}
          />
          <FormErrorMessage>{validationErrors[getGuestKey(field.name)]}</FormErrorMessage>
        </FormControl>;
      })}
      {willChangeInfo && <Checkbox my={2} isChecked={reservation.updateInfo} onChange={handleEditChange('updateInfo')}>
          お客様の登録情報を更新する
      </Checkbox>}
    </Box>
    <Center>
      <Button m={1} onClick={handleClickConfirm} disabled={!isValidGuest || isConfirming}>
        次へ
      </Button>
      <Button m={1} colorScheme="red" onClick={onDetail} disabled={isConfirming}>
        戻る
      </Button>
    </Center>
  </Box>;
});

GuestInfo.displayName = 'GuestInfo';
export default GuestInfo;
