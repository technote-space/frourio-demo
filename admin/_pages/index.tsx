import type { Page, Menu } from '~/types';
import type { Dispatch } from '~/store';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  Today as TodayIcon,
  ExitToApp as LogoutIcon,
  Description as LicenseIcon,
} from '@material-ui/icons';
import Dashboard from './dashboard';
import Guests from './guests';
import Reservations from './reservations';
import Rooms from './rooms';
import { logout, openLicense } from '~/utils/actions';

const pages: Record<string, Page> = {
  dashboard: {
    label: 'ダッシュボード',
    page: Dashboard,
    icon: DashboardIcon,
  },
  rooms: {
    label: '部屋',
    page: Rooms,
    icon: HotelIcon,
  },
  guests: {
    label: '宿泊客',
    page: Guests,
    icon: PeopleIcon,
  },
  reservations: {
    label: '予約',
    page: Reservations,
    icon: TodayIcon,
  },
} as const;

export const menus: Record<string, Menu> = {
  logout: {
    label: 'ログアウト',
    icon: LogoutIcon,
    onClick: (dispatch: Dispatch) => {
      logout(dispatch);
    },
  },
  license: {
    label: 'ライセンス',
    icon: LicenseIcon,
    onClick: (dispatch: Dispatch) => {
      openLicense(dispatch);
    },
    always: true,
  },
} as const;

export type MenuKeys = keyof typeof menus;
export type PageKeys = keyof typeof pages;
export default pages;
