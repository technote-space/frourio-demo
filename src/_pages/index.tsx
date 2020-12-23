import { Icon } from '@chakra-ui/react';
import { MdDashboard, MdPeople } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';
import { BsCalendar } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import Dashboard from '~/_pages/dashboard';
import Guests from '~/_pages/guests';
import Reservations from '~/_pages/reservations';
import Rooms from '~/_pages/rooms';
import { addDisplayName } from '~/utils/component';

const pages = {
  dashboard: {
    label: 'Dashboard',
    page: Dashboard,
    icon: addDisplayName('DashboardIcon', () => <Icon as={MdDashboard}/>),
  },
  rooms: {
    label: 'Rooms',
    page: Rooms,
    icon: addDisplayName('RoomsIcon', () => <Icon as={FaBed}/>),
  },
  guests: {
    label: 'Guests',
    page: Guests,
    icon: addDisplayName('GuestsIcon', () => <Icon as={MdPeople}/>),
  },
  reservations: {
    label: 'Reservations',
    page: Reservations,
    icon: addDisplayName('ReservationsIcon', () => <Icon as={BsCalendar}/>),
  },
  logout: {
    label: 'Logout',
    page: null,
    icon: addDisplayName('LogoutIcon', () => <Icon as={FiLogOut}/>)
  }
} as const;

export type PageKeys = keyof typeof pages;

export default pages;
