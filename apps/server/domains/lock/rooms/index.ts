import type { BodyResponse } from '$/types';
import type { Room } from '$/repositories/room';
import type { Reservation } from '$/repositories/reservation';
import type { ValidateRoomKeyResult, ValidateRoomQrResult } from '@frourio-demo/types';
import { depend } from 'velona';
import { toDataURL } from 'qrcode';
import { getRooms, getRoom, updateRoom } from '$/repositories/room';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { decryptQrInfo, encryptQrInfo, generateRoomKey } from '$/utils/reservation';
import { getValidReservation, isValidCheckinDateRange } from '$/service/reservation';
import { sendRoomKeyMail } from '$/service/mail';
import { MAX_TRIALS } from '@frourio-demo/constants';

export type RoomWithValidReservation = Room & {
  reservation?: Reservation;
}

export const list = depend(
  { getRooms },
  async({ getRooms }): Promise<BodyResponse<Room[]>> => ({
    status: 200,
    body: await getRooms(),
  }),
);

export const get = depend(
  { getRoom, getValidReservation },
  async({ getRoom, getValidReservation }, id: number): Promise<BodyResponse<RoomWithValidReservation>> => ({
    status: 200,
    body: {
      ...await getRoom(id),
      reservation: await getValidReservation(id, new Date(), ['checkin']),
    },
  }),
);

export const checkout = depend(
  { getValidReservation, updateReservation },
  async({ getValidReservation, updateReservation }, roomId: number): Promise<BodyResponse<Reservation>> => {
    const reservation = await getValidReservation(roomId, new Date());
    if (!reservation) {
      return {
        status: 400,
      };
    }

    return {
      status: 200,
      body: await updateReservation(reservation.id, {
        status: 'checkout',
      }),
    };
  },
);

export const validateKey = depend(
  { getRoom, getValidReservation, updateRoom, updateReservation, generateRoomKey, encryptQrInfo, toDataURL },
  async({
    getRoom,
    getValidReservation,
    updateRoom,
    updateReservation,
    generateRoomKey,
    encryptQrInfo,
    toDataURL,
  }, roomId: number, key: string): Promise<BodyResponse<ValidateRoomKeyResult>> => {
    const reservation = await getValidReservation(roomId, new Date());
    if (!reservation) {
      return {
        status: 200,
        body: {
          result: false,
          message: '有効な予約が見つかりません。',
        },
      };
    }

    const room = await getRoom(roomId);
    if (room.key === key) {
      await updateReservation(reservation.id, {
        status: 'checkin',
      });
      await updateRoom(roomId, { trials: 0 });
      return {
        status: 200,
        body: {
          result: true,
          reservation,
        },
      };
    }

    if (room.trials + 1 >= MAX_TRIALS) {
      const key = generateRoomKey();
      await updateRoom(roomId, { key, trials: 0 });
      await sendRoomKeyMail(reservation, key, await toDataURL(encryptQrInfo({
        reservationId: reservation.id,
        roomId: reservation.roomId!,
        key,
      })));
      return {
        status: 200,
        body: {
          result: false,
          message: '入室情報が再送されました。メールに記載された番号を入力してください。',
        },
      };
    }

    await updateRoom(roomId, {
      trials: {
        increment: 1,
      },
    });
    return {
      status: 200,
      body: {
        result: false,
        message: '正しい番号を入力してください。',
      },
    };
  },
);

export const validateQr = depend(
  { getReservation, getRoom, updateReservation, decryptQrInfo, isValidCheckinDateRange },
  async({
    getReservation,
    getRoom,
    updateReservation,
    decryptQrInfo,
    isValidCheckinDateRange,
  }, roomId: number, data: string): Promise<BodyResponse<ValidateRoomQrResult>> => {
    const info = decryptQrInfo(data);
    if (!info) {
      return {
        status: 400,
      };
    }

    const reservation = await getReservation(info.reservationId);
    if (!isValidCheckinDateRange(reservation.checkin, reservation.checkout, new Date()) && !['reserved', 'checkin'].some(status => reservation.status === status)) {
      return {
        status: 200,
        body: {
          result: false,
          message: '無効なQRコードです。',
        },
      };
    }

    const room = await getRoom(roomId);
    if (room.key === info.key) {
      await updateReservation(reservation.id, {
        status: 'checkin',
      });
      return {
        status: 200,
        body: {
          result: true,
          reservation,
        },
      };
    }

    return {
      status: 200,
      body: {
        result: false,
        message: '無効なQRコードです。',
      },
    };
  },
);
