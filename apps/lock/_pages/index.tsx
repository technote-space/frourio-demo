import type { Page } from '#/types';
import Top from './top';
import Rooms from './rooms';
import Room from './room';

const pages: Record<string, Page> = {
  top: {
    path: '/',
    exact: true,
    label: 'トップ',
    page: Top,
  },
  rooms: {
    label: 'お部屋',
    page: Rooms,
  },
  room: {
    path: '/room/:id',
    label: 'お部屋',
    page: Room,
  },
};

export type PageKeys = keyof typeof pages;
export default pages;
