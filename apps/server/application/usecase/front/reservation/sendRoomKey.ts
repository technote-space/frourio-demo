import type { IRoomRepository } from '$/domain/database/room';
import type { IRoomKeyRepository } from '$/domain/database/roomKey';
import type { IReservationRepository } from '$/domain/database/reservation';
import type { IMailRepository } from '$/domain/mail';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { toDataURL } from 'qrcode';
import { encryptQrInfo } from '$/application/service/reservation';
import { sleep } from '@frourio-demo/utils/misc';
import { getValidReservation } from '$/application/service/reservation';

@singleton()
export class SendRoomKeyUseCase {
  public constructor(
    @inject('IReservationRepository') private reservationRepository: IReservationRepository,
    @inject('IRoomRepository') private roomRepository: IRoomRepository,
    @inject('IRoomKeyRepository') private roomKeyRepository: IRoomKeyRepository,
    @inject('IMailRepository') private mail: IMailRepository,
  ) {
  }

  execute = depend(
    { getValidReservation, sleep, toDataURL, encryptQrInfo },
    async({ getValidReservation, sleep, toDataURL, encryptQrInfo }) => {
      await (await this.roomRepository.list()).reduce(async(prev, room) => {
        await prev;
        const reservation = await getValidReservation(this.reservationRepository, room.id, new Date());
        if (!reservation) {
          return;
        }

        await sleep(1000);
        const roomKey = await this.roomKeyRepository.create(reservation);
        await this.mail.sendRoomKeyMail(reservation, roomKey.key, await toDataURL(encryptQrInfo({
          reservationId: reservation.id,
          roomId: reservation.roomId,
          key: roomKey.key,
        })));
      }, Promise.resolve());
    },
  );
}
