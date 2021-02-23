import type { IReservationRepository } from '$/packages/domain/database/reservation';
import type { IRoomKeyRepository } from '$/packages/domain/database/roomKey';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { IMailRepository } from '$/packages/domain/mail';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { toDataURL } from 'qrcode';
import { encryptQrInfo } from '$/packages/application/service/reservation';

@singleton()
export class SendRoomKeyUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IRoomKeyRepository') private roomKeyRepository: IRoomKeyRepository,
    @inject('IMailRepository') private mail: IMailRepository,
    @inject('IResponseRepository') private response: IResponseRepository) {
  }

  execute = depend(
    { encryptQrInfo, toDataURL },
    async({ encryptQrInfo, toDataURL }, id: number) => {
      const reservation = await this.reservationRepository.find(id);
      const roomKey = await this.roomKeyRepository.create(reservation);

      await this.mail.sendRoomKeyMail(reservation, roomKey.key, await toDataURL(encryptQrInfo({
        reservationId: reservation.id,
        roomId: reservation.roomId,
        key: roomKey.key,
      })));

      return this.response.accepted(reservation);
    },
  );
}
