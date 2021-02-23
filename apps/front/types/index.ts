import type { FC } from 'react';
import type { Guest } from '$/domain/database/guest';

export type NoticeType = {
  title: string,
  description: string,
  status: 'error' | 'info' | 'success' | 'warning',
}
export type ContextState = {
  guest?: Partial<Guest>;
  title?: string;
  notices: NoticeType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorage?: Record<string, any>;
  onRemoveToken: boolean;
  onRefreshToken: boolean;
};

export type Page = {
  path?: string;
  exact?: boolean;
  label: string;
  page: FC;
};

export type Address = {
  'prefecture_jis_code': string;
  'city_jis_code': string;
  'zip_code': string;
  'prefecture_name_kana': string;
  'city_name_kana': string;
  'town_name_kana': string;
  'prefecture_name': string;
  'city_name': string;
  'town_name': string;
}
