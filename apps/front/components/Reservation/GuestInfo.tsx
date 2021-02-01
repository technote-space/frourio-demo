import type { FC } from 'react';
import type { ReservationData } from './index';
import { useMemo, useState, useCallback } from 'react';
import { Box, Link, Input, FormControl, FormLabel, Heading, Checkbox } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
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

const GuestInfo: FC<Props> = (props: Props) => {
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
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    props[`onChange${key}`](event.target.value);
  };
  const fieldView = useMemo(() => <Box m={1} p={2} borderWidth={1}>
    <Link onClick={handleOpen}>
      <Heading as="h4" size="md">お客様情報</Heading>
      {reservation.guestName && <Box>{reservation.guestName}</Box>}
    </Link>
  </Box>, [reservation.guestName]);
  const modalBodyView = useMemo(() => {
    return ACCOUNT_FIELDS.filter(field => field.name !== 'email').map(field => {
      const key = field.name.charAt(0).toUpperCase() + field.name.slice(1);
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
    });
  }, [reservation]);

  return <>
    {fieldView}
    <Modal isOpen={open} onClose={handleClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>お客様情報</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          {modalBodyView}
          {guest && <Checkbox
            my={2}
            isChecked={reservation.updateInfo}
            onChange={handleEditChange('updateInfo')}
          >お客様情報を更新する</Checkbox>}
        </ModalBody>
      </ModalContent>
    </Modal>
  </>;
};

export default GuestInfo;
