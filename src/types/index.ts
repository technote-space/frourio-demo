import type { UseToastOptions } from '@chakra-ui/react';
import type { PageKeys } from '~/_pages';

export type ContextState = {
  name?: string;
  icon?: string;
  isSidebarOpen: boolean;
  loadingModal: {
    title?: string;
    message?: string;
    isOpen: boolean;
  };
  page: PageKeys;
  prevPage?: PageKeys;
  toasts: UseToastOptions[];
};
