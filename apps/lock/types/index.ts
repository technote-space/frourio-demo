import type { FC } from 'react';

export type NoticeType = {
  title: string,
  description: string,
  status: 'error' | 'info' | 'success' | 'warning',
}
export type ContextState = {
  title?: string;
  notices: NoticeType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorage?: Record<string, any>;
};

export type Page = {
  path?: string;
  exact?: boolean;
  label: string;
  page: FC;
};
