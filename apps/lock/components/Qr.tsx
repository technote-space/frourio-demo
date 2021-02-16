import type { FC } from 'react';
import { memo, useState, useCallback } from 'react';
import { Box, Button } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import QrReader from 'react-qr-reader';
import { useDispatchContext } from '#/store';
import { client } from '#/utils/api';
import { setNotice, setError } from '#/utils/actions';

type Props = {
  roomId: number;
  isSending: boolean;
  setIsSending: (flag: boolean) => void;
  revalidate: () => Promise<boolean>;
}

const Checkout: FC<Props> = memo(({ roomId, isSending, setIsSending, revalidate }: Props) => {
  const { dispatch } = useDispatchContext();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const handleScan = useCallback(data => {
    if (data !== null) {
      setIsSending(true);
      setOpen(false);
      client.rooms._roomId(roomId).qr.post({ body: { roomId, data } }).then(data => {
        if (data.body.result) {
          setNotice(dispatch, 'Unlocked!!');
        } else {
          setError(dispatch, data.body.message);
        }
      }).catch(error => {
        setError(dispatch, error.message);
      }).finally(() => {
        revalidate().finally(() => {
          setIsSending(false);
        });
      });
    }
  }, []);
  const handleError = useCallback(error => {
    setError(dispatch, error.message);
    setOpen(false);
  }, []);

  return <Box p={5} m={5} shadow="md" borderWidth={1} background="teal">
    <Button onClick={handleOpen} isDisabled={isSending}>スキャン</Button>
    <Modal isOpen={open} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>スキャン</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mt={3}>
            <QrReader
              delay={1000}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
              resolution={1000}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  </Box>;
});

Checkout.displayName = 'Checkout';
export default Checkout;
