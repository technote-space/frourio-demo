import type { Page } from '#/types';
import Top from './top';
import Rooms from './rooms';
import Keypad from './keypad';
import Qr from './qr';

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
  keypad: {
    path: '/keypad/:id',
    label: 'キーパッド',
    page: Keypad,
  },
  qr: {
    label: 'QR',
    page: Qr,
  },
};

export type PageKeys = keyof typeof pages;
export default pages;
