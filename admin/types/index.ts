import type { FC } from 'react';
import type { SvgIconComponent } from '@material-ui/icons';
import type { PageKeys } from '~/_pages';
import { Dispatch } from '~/store';

export type ContextState = {
  name?: string;
  icon?: string;
  isSidebarOpen: boolean;
  isLicenseOpen: boolean;
  page: PageKeys;
  title?: string;
  notice: {
    open: boolean,
    message: string,
    variant: 'error' | 'info' | 'success' | 'warning',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localStorage?: Record<string, any>;
  onRemoveToken: boolean;
};

export type Page = {
  label: string;
  page: FC;
  icon: SvgIconComponent;
};
export type Menu = {
  label: string;
  icon: SvgIconComponent;
  onClick: (dispatch: Dispatch) => void;
  always?: boolean;
};

export type MaybeUndefined<T> = undefined extends T ? undefined : never;

export type ThemeColor = 'light' | 'dark';

export type RawLicenseType = {
  name: string;
  version: string;
  licenses: string | Array<string>;
  repository?: string;
  licenseText: string;
};
export type License = {
  name: string;
  version: string;
  licenses: string;
  repository?: string;
  licenseText: string;
};
