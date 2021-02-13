import { schedule } from 'node-cron';
import { sendRoomKey } from '$/domains/front/reservation';
import { logger } from '$/service/logging';

export const setup = () => {
  schedule('0 12 * * *', () => {
    logger.info('start send room key');
    sendRoomKey().finally(() => {
      logger.info('finish send room key');
    });
  }, {
    timezone: 'Asia/Tokyo',
  });
};
