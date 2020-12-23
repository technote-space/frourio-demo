import type { FC } from 'react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Text, CircularProgress } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import { useStoreContext, useDispatchContext } from '~/store';
import styles from '~/styles/components/LoadingModal.module.scss';

const LoadingModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loadingModal }    = useStoreContext();
  const { dispatch }        = useDispatchContext();

  const handleClose = useCallback(() => dispatch({ type: 'LOADING_MODAL', loadingModal: { isOpen: false } }), []);

  useEffect(() => {
    setIsOpen(loadingModal.isOpen);
  }, [loadingModal.isOpen]);

  return useMemo(() => <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleClose} isCentered>
    <ModalOverlay/>
    <ModalContent className={styles.wrap}>
      {loadingModal.title && <ModalHeader>{loadingModal.title}</ModalHeader>}
      <ModalBody pb={3} className={styles.body}>
        <CircularProgress isIndeterminate color="green.300"/>
        {loadingModal.message && <Text mt={3}>{loadingModal.message}</Text>}
      </ModalBody>
    </ModalContent>
  </Modal>, [isOpen]);
};

export default LoadingModal;
