import type { Dispatch } from '@frourio-demo/types';
import type { Page, Menu } from '~/types';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  Today as TodayIcon,
  ExitToApp as LogoutIcon,
  Description as LicenseIcon,
  SupervisorAccount as AdminIcon,
} from '@material-ui/icons';
import Dashboard from './dashboard';
import Guests from './guests';
import Reservations from './reservations';
import Rooms from './rooms';
import Admins from './admins';
import { logout, openLicense } from '~/utils/actions';

const pages: Record<string, Page> = {
  dashboard: {
    label: 'ダッシュボード',
    page: Dashboard,
    icon: DashboardIcon,
    roleCheck: false,
  },
  rooms: {
    label: '部屋',
    page: Rooms,
    icon: HotelIcon,
    roleCheck: true,
  },
  guests: {
    label: '宿泊客',
    page: Guests,
    icon: PeopleIcon,
    roleCheck: true,
  },
  reservations: {
    label: '予約',
    page: Reservations,
    icon: TodayIcon,
    roleCheck: true,
  },
  admins: {
    label: '管理者',
    page: Admins,
    icon: AdminIcon,
    roleCheck: true,
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
