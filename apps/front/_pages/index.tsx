import type { Page } from '^/types';
import Top from './top';
import Account from './account';
import Reservations from './reservations';
import Reservation from './reservation';
import Rooms from './rooms';
import Room from './room';
import Meal from './meal';
import Facility from './facility';
import Info from './info';

const pages: Record<string, Page> = {
  top: {
    path: '/',
    exact: true,
    label: 'トップ',
    page: Top,
  },
  account: {
    label: 'アカウント',
    page: Account,
  },
  reservations: {
    label: 'ご予約',
    page: Reservations,
  },
  reservation: {
    path: '/reservation/:id',
    label: 'ご予約詳細',
    page: Reservation,
  },
  rooms: {
    label: 'お部屋',
    page: Rooms,
  },
  room: {
    path: '/room/:id',
    label: 'お部屋詳細',
    page: Room,
  },
  meal: {
    label: 'お食事',
    page: Meal,
  },
  facility: {
    label: '設備',
    page: Facility,
  },
  info: {
    label: 'お知らせ',
    page: Info,
  },
};

export type PageKeys = keyof typeof pages;
export default pages;
