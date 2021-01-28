import type { FC } from 'react';
import type { PageKeys } from '^/_pages';

export type NoticeType = {
  title: string,
  description: string,
  status: 'error' | 'info' | 'success' | 'warning',
}
export type ContextState = {
  name?: string;
  icon?: string;
  page: PageKeys;
  title?: string;
  notices: NoticeType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorage?: Record<string, any>;
  onRemoveToken: boolean;
  onRefreshToken: boolean;
};

export type Page = {
  label: string;
  page: FC;
};
