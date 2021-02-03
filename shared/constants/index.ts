/* eslint-disable @typescript-eslint/no-explicit-any */

export const ACCOUNT_FIELDS = [
  { name: 'email', label: 'メールアドレス' },
  { name: 'name', label: '名前' },
  { name: 'nameKana', label: 'かな名' },
  { name: 'zipCode', label: '郵便番号' },
  { name: 'address', label: '住所' },
  { name: 'phone', label: '電話番号' },
] as const;
export const RESERVATION_GUEST_FIELDS = ['name', 'nameKana', 'zipCode', 'address', 'phone'] as const;
