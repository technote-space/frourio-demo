import type { Page } from '^/types';
import Top from './top';
import Account from './account';
import Reservations from './reservations';
import Reservation from './reservation';
import Rooms from './rooms';

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
  meal: {
    label: 'お食事',
    page: Rooms,
  },
  facility: {
    label: '設備',
    page: Rooms,
  },
  price: {
    label: '料金',
    page: Rooms,
  },
  info: {
    label: 'お知らせ',
    page: Rooms,
  },
};

export type PageKeys = keyof typeof pages;
export default pages;
