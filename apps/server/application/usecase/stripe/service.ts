import type { Reservation } from '$/domain/database/reservation';
import type { IReservationRepository } from '$/domain/database/reservation';
import type { IPaymentRepository } from '$/domain/payment';
import { logger } from '$/utils/logger';

export const createPaymentIntents = async(payment: IPaymentRepository, amount: number, guest: { id?: number; paymentId?: string | null }, paymentMethodsId: string) => {
  logger.info('createPaymentIntents, id=%s, guest=%d, amount=%d', paymentMethodsId, guest.id, amount);
  return payment.createPaymentIntents(amount, guest, paymentMethodsId);
};

export const cancelPaymentIntents = async(repository: IReservationRepository, payment: IPaymentRepository, reservation: { id: number, paymentIntents: string | null }) => {
  logger.info('cancelPaymentIntents, reservationId=%d, paymentIntents=%s', reservation.id, reservation.paymentIntents);
  await payment.cancelPaymentIntents(reservation);
  return repository.update(reservation.id, { status: 'cancelled' });
};

export const capturePaymentIntents = async(repository: IReservationRepository, payment: IPaymentRepository, reservation: Reservation, isCancel?: boolean): Promise<Reservation> => {
  logger.info('capturePaymentIntents, reservation=%d, payment=%d, id=%s, isCancel=%d', reservation.id, reservation.payment, reservation.paymentIntents, isCancel);
  const result = await payment.capturePaymentIntents(reservation, isCancel);
  const status = isCancel ? 'cancelled' : 'checkin';
  if (result) {
    logger.info('capturePaymentIntents, amount=%d, amount_received=%d', result.amount, result.amountReceived);
    return repository.update(reservation.id, {
      payment: result.amountReceived,
      status,
    });
  }

  return repository.update(reservation.id, {
    status,
  });
};
