import type { FC } from 'react';
import type { ReservationData } from './index';
import { memo, useState, useCallback } from 'react';
import { Box, Link, Input, FormControl, FormLabel, Heading, Checkbox, GridItem } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
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
  onChangeUpdateInfo: (updateInfo: string) => void;
}

const GuestInfo: FC<Props> = memo((props: Props) => {
  const reservation = props.reservation;
  const { guest } = useStoreContext();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleEditChange = (name: string) => event => {
    const key = startWithUppercase(name);
    props[`onChange${key}`](event.target.value);
  };

  return <GridItem>
    <Box m={1} p={2} borderWidth={1} height="100%">
      <Link onClick={handleOpen}>
        <Heading as="h4" size="md">お客様情報</Heading>
        {reservation.guestName && <Box>{reservation.guestName}</Box>}
      </Link>
    </Box>
    <Modal isOpen={open} onClose={handleClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>お客様情報</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  </GridItem>;
});

GuestInfo.displayName = 'GuestInfo';
export default GuestInfo;
