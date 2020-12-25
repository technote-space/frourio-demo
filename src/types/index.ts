import type { PageKeys } from '~/_pages';

export type ContextState = {
  themeColor?: 'light' | 'dark';
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
  title?: string;
  notice: {
    open: boolean,
    message: string,
    variant: 'error' | 'info' | 'success' | 'warning',
  }
};
