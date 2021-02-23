import type { IRoomKeyRepository } from '$/domain/database/roomKey';
import type { IReservationRepository } from '$/domain/database/reservation';
import type { IPaymentRepository } from '$/domain/payment';
import type { IResponseRepository } from '$/domain/http/response';
import type { ValidateRoomQrResult } from '@frourio-demo/types';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { decryptQrInfo } from '$/application/service/reservation';
import { capturePaymentIntents } from '$/application/usecase/stripe/service';
import { isValidCheckinDateRange } from '$/application/service/reservation';

@singleton()
export class ValidateQrUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IRoomKeyRepository') private roomKeyRepository: IRoomKeyRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { isValidCheckinDateRange, decryptQrInfo },
    async({ isValidCheckinDateRange, decryptQrInfo }, roomId: number, data: string) => {
      const info = decryptQrInfo(data);
      if (!info) {
        return this.response.badRequest();
      }

      const reservation = await this.reservationRepository.find(info.reservationId);
      if (!isValidCheckinDateRange(reservation.checkin, reservation.checkout, new Date()) || !['reserved', 'checkin'].some(status => reservation.status === status)) {
        return this.response.success({
          result: false,
          message: '無効なQRコードです。',
        } as ValidateRoomQrResult);
      }

      const roomKey = await this.roomKeyRepository.find(reservation.id);
      if (roomKey?.key === info.key) {
        return this.response.success({
          result: true,
          reservation: await capturePaymentIntents(this.reservationRepository, this.payment, reservation),
        } as ValidateRoomQrResult);
      }

      return this.response.success({
        result: false,
        message: '無効なQRコードです。',
      } as ValidateRoomQrResult);
    },
  );
}
