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
    label: 'Dashboard',
    page: Dashboard,
    icon: DashboardIcon,
  },
  rooms: {
    label: 'Rooms',
    page: Rooms,
    icon: HotelIcon,
  },
  guests: {
    label: 'Guests',
    page: Guests,
    icon: PeopleIcon,
  },
  reservations: {
    label: 'Reservations',
    page: Reservations,
    icon: TodayIcon,
  },
  logout: {
    label: 'Logout',
    page: null,
    icon: LogoutIcon,
  },
} as const;

export type PageKeys = keyof typeof pages;

export default pages;
