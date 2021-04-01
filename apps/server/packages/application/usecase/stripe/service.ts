import type { Reservation } from '$/packages/domain/database/reservation';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IPaymentRepository } from '$/packages/domain/payment';
import type { IMailRepository } from '$/packages/domain/mail';
import { logger } from '$/utils/logger';
import { CANCEL_PAYMENT_RATE } from '@frourio-demo/constants';

export const createPaymentIntents = async(payment: IPaymentRepository, amount: number, guest: { id?: number; paymentId?: string | null }, paymentMethodsId: string) => {
  logger.info('createPaymentIntents, id=%s, guest=%d, amount=%d', paymentMethodsId, guest.id, amount);
  return payment.createPaymentIntents(amount, guest, paymentMethodsId);
};

export const cancelPaymentIntents = async(repository: IReservationRepository, payment: IPaymentRepository, reservation: { id: number, paymentIntents: string | null }) => {
  logger.info('cancelPaymentIntents, reservationId=%d, paymentIntents=%s', reservation.id, reservation.paymentIntents);
  await payment.cancelPaymentIntents(reservation);
  return repository.update(reservation.id, { status: 'cancelled' });
};

export const capturePaymentIntents = async(
  reservationRepository: IReservationRepository,
  paymentRepository: IPaymentRepository,
  mailRepository: IMailRepository,
  reservation: Reservation,
  isCancel?: boolean,
): Promise<Reservation> => {
  logger.info('capturePaymentIntents, reservation=%d, payment=%d, id=%s, isCancel=%d', reservation.id, reservation.payment, reservation.paymentIntents, isCancel);
  const result = await paymentRepository.capturePaymentIntents(reservation, isCancel);
  const status = isCancel ? 'cancelled' : 'checkin';
  if (result) {
    logger.info('capturePaymentIntents, amount=%d, amount_received=%d', result.amount, result.amountReceived);
    const updated = await reservationRepository.update(reservation.id, {
      payment: result.amountReceived,
      status,
    });
    mailRepository.sendPaidMail(updated, isCancel ?
      `¥${result.amountReceived.toLocaleString()} (キャンセル料金 ${CANCEL_PAYMENT_RATE * 100}%)` :
      `¥${result.amountReceived.toLocaleString()}`);
    return updated;
  }

  return reservationRepository.update(reservation.id, {
    status,
  });
};
