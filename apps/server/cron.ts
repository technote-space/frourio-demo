import { schedule } from 'node-cron';
import { sendRoomKey } from '$/domains/front/reservation';
import { checkoutReservations } from '$/domains/stripe';
import { logger } from '$/utils/logging';

export const setup = () => {
  schedule('0 12 * * *', () => {
    logger.info('start send room key');
    sendRoomKey().finally(() => {
      logger.info('finish send room key');
    });
  }, {
    timezone: 'Asia/Tokyo',
  });
  schedule('30 12 * * *', () => {
    logger.info('start checkout check');
    checkoutReservations().finally(() => {
      logger.info('finish checkout check');
    });
  }, {
    timezone: 'Asia/Tokyo',
  });
};
