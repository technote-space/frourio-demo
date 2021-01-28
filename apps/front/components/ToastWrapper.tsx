import type { FC } from 'react';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useDispatchContext, useStoreContext } from '^/store';
import { clearNotices } from '^/utils/actions';

const ToastWrapper: FC = () => {
  const { notices } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const toast = useToast();

  useEffect(() => {
    if (notices.length) {
      clearNotices(dispatch);
      notices.filter(notice => notice.title || notice.description).forEach(notice => {
        toast({
          ...notice,
          duration: 9000,
          isClosable: true,
        });
      });
    }
  }, [notices.length]);

  return null;
};

export default ToastWrapper;
