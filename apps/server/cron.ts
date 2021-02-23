import { schedule } from 'node-cron';
import { SendRoomKeyUseCase } from '$/application/usecase/front/reservation/sendRoomKey';
import { CheckoutReservationsUseCase } from '$/application/usecase/stripe/checkoutReservations';
import { container } from 'tsyringe';
import { logger } from '$/utils/logger';

export const setup = () => {
  schedule('0 12 * * *', () => {
    logger.info('start send room key');
    container.resolve(SendRoomKeyUseCase).execute().finally(() => {
      logger.info('finish send room key');
    });
  }, {
    timezone: 'Asia/Tokyo',
  });
  schedule('30 12 * * *', () => {
    logger.info('start checkout check');
    container.resolve(CheckoutReservationsUseCase).execute().finally(() => {
      logger.info('finish checkout check');
    });
  }, {
    timezone: 'Asia/Tokyo',
  });
};
