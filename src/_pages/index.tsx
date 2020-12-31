import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  Today as TodayIcon,
  ExitToApp as LogoutIcon,
} from '@material-ui/icons';
import Dashboard from './dashboard';
import Guests from './guests';
import Reservations from './reservations';
import Rooms from './rooms';

const pages = {
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
  logout: {
    label: 'ログアウト',
    page: null,
    icon: LogoutIcon,
  },
} as const;

export type PageKeys = keyof typeof pages;

export default pages;
