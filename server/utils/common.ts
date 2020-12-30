export const getDays = (checkin: Date, checkout: Date): number => {
  const d1 = new Date(checkin.valueOf());
  const d2 = new Date(checkout.valueOf());
  d1.setHours(12, 0, 0, 0);
  d2.setHours(12, 0, 0, 0);
  return Math.abs(d2.getTime() - d1.getTime()) / 24 / 3600 / 1000;
};
