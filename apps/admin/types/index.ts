import type { FC } from 'react';
import type { SvgIconComponent } from '@material-ui/icons';
import type { PageKeys } from '~/_pages';
import type { Dispatch } from '@frourio-demo//types';

export type ContextState = {
  name?: string;
  icon?: string;
  roles?: string[];
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
  onRefreshToken: boolean;
};

export type Page = {
  label: string;
  page: FC;
  icon: SvgIconComponent;
  roleCheck: boolean;
};
export type Menu = {
  label: string;
  icon: SvgIconComponent;
  onClick: (dispatch: Dispatch) => void;
  always?: boolean;
};

export type ThemeColor = 'light' | 'dark';
