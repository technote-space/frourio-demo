import { PageKeys } from '~/_pages';

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
};
