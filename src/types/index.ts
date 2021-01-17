import type { PageKeys } from '~/_pages';

export type ContextState = {
  name?: string;
  icon?: string;
  isSidebarOpen: boolean;
  page: PageKeys;
  prevPage?: PageKeys;
  title?: string;
  notice: {
    open: boolean,
    message: string,
    variant: 'error' | 'info' | 'success' | 'warning',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorage?: Record<string, any>;
};

export type MaybeUndefined<T> = undefined extends T ? undefined : never;

export type ThemeColor = 'light' | 'dark';
