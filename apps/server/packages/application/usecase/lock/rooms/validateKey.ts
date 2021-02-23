import type { IRoomKeyRepository } from '$/packages/domain/database/roomKey';
import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IPaymentRepository } from '$/packages/domain/payment';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IMailRepository } from '$/packages/domain/mail';
import type { ValidateRoomKeyResult } from '@frourio-demo/types';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { toDataURL } from 'qrcode';
import { getValidReservation, encryptQrInfo } from '$/packages/application/service/reservation';
import { capturePaymentIntents } from '$/packages/application/usecase/stripe/service';
import { MAX_TRIALS } from '@frourio-demo/constants';

@singleton()
export class ValidateKeyUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IRoomKeyRepository') private roomKeyRepository: IRoomKeyRepository,
    @inject('IPaymentRepository') private payment: IPaymentRepository,
    @inject('IMailRepository') private mail: IMailRepository,
    @inject('IResponseRepository') private response: IResponseRepository,
  ) {
  }

  execute = depend(
    { getValidReservation, toDataURL, encryptQrInfo },
    async({ getValidReservation, toDataURL, encryptQrInfo }, roomId: number, key: string) => {
      const reservation = await getValidReservation(this.reservationRepository, roomId, new Date());
      if (!reservation) {
        return this.response.success({
          result: false,
          message: '有効な予約が見つかりません。',
        } as ValidateRoomKeyResult);
      }

      const roomKey = await this.roomKeyRepository.find(reservation.id);
      if (!roomKey || (roomKey.key !== key && roomKey.trials + 1 >= MAX_TRIALS)) {
        const newRoomKey = await this.roomKeyRepository.create(reservation);
        await this.mail.sendRoomKeyMail(reservation, newRoomKey.key, await toDataURL(encryptQrInfo({
          reservationId: reservation.id,
          roomId: reservation.roomId!,
          key: newRoomKey.key,
        })));
        return this.response.success({
          result: false,
          message: '入室情報が再送されました。メールに記載された番号を入力してください。',
        } as ValidateRoomKeyResult);
      }

      if (roomKey.key === key) {
        const captured = await capturePaymentIntents(this.reservationRepository, this.payment, reservation);
        await this.roomKeyRepository.update(roomKey.id, { trials: 0 });
        return this.response.success({
          result: true,
          reservation: captured,
        } as ValidateRoomKeyResult);
      }

      await this.roomKeyRepository.update(roomKey.id, {
        trials: {
          increment: 1,
        },
      });

      return this.response.success({
        result: false,
        message: '正しい番号を入力してください。',
      } as ValidateRoomKeyResult);
    },
  );
}
