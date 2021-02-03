import type { FC } from 'react';
import type { ReservationData } from './index';
import { memo } from 'react';
import { Box, Input, FormControl, FormLabel, Heading, Checkbox, GridItem } from '@chakra-ui/react';
import { startWithUppercase } from '@frourio-demo/utils/string';
import { useStoreContext } from '^/store';
import { ACCOUNT_FIELDS } from '^/utils/constants';

type Props = {
  reservation: ReservationData;
  onChangeName: (name: string) => void;
  onChangeNameKana: (name: string) => void;
  onChangeZipCode: (zipcode: string) => void;
  onChangeAddress: (address: string) => void;
  onChangePhone: (phone: string) => void;
  onChangeUpdateInfo: () => void;
}

const GuestInfo: FC<Props> = memo((props: Props) => {
  const reservation = props.reservation;
  const { guest } = useStoreContext();

  const handleEditChange = (name: string) => event => {
    const key = startWithUppercase(name);
    props[`onChange${key}`](event.target.value);
  };

  return <Box>
    <Box m={1} p={2} height="100%">
      <Heading as="h4" size="md">お客様情報</Heading>
      {ACCOUNT_FIELDS.filter(field => field.name !== 'email').map(field => {
        const key = startWithUppercase(field.name);
        return <FormControl
          key={field.name}
          id={`edit-${field.name}`}
          mb={2}
        >
          <FormLabel htmlFor={`edit-${field.name}`}>{field.label}</FormLabel>
          <Input
            value={reservation[`guest${key}`]}
            onChange={handleEditChange(field.name)}
          />
        </FormControl>;
      })}
      {guest && <Checkbox
        my={2}
        isChecked={reservation.updateInfo}
        onChange={handleEditChange('updateInfo')}
      >お客様情報を更新する</Checkbox>}
    </Box>
  </Box>;
});

GuestInfo.displayName = 'GuestInfo';
export default GuestInfo;
