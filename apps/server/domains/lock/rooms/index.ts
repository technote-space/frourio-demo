import type { BodyResponse } from '$/types';
import type { Room } from '$/repositories/room';
import type { Reservation } from '$/repositories/reservation';
import type { ValidateRoomKeyResult, ValidateRoomQrResult } from '@frourio-demo/types';
import { depend } from 'velona';
import { toDataURL } from 'qrcode';
import { getRooms, getRoom } from '$/repositories/room';
import { getRoomKey, createRoomKey, updateRoomKey } from '$/repositories/roomKey';
import { getReservation, updateReservation } from '$/repositories/reservation';
import { decryptQrInfo, encryptQrInfo } from '$/utils/reservation';
import { getValidReservation, isValidCheckinDateRange } from '$/service/reservation';
import { sendRoomKeyMail } from '$/service/mail';
import { capturePaymentIntents } from '$/domains/stripe';
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
      reservation: await getValidReservation(id, new Date()),
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

export const checkinProcess = depend(
  { updateReservation, capturePaymentIntents },
  async({ updateReservation, capturePaymentIntents }, reservation: Reservation): Promise<BodyResponse<{
    result: true,
    reservation: Reservation;
  }>> => {
    await updateReservation(reservation.id, {
      status: 'checkin',
    });
    await capturePaymentIntents(reservation);
    return {
      status: 200,
      body: {
        result: true,
        reservation,
      },
    };
  },
);

export const validateKey = depend(
  { getRoomKey, getValidReservation, createRoomKey, updateRoomKey, encryptQrInfo, toDataURL, checkinProcess },
  async({
    getRoomKey,
    getValidReservation,
    createRoomKey,
    updateRoomKey,
    encryptQrInfo,
    toDataURL,
    checkinProcess,
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

    const roomKey = await getRoomKey(reservation.id);
    if (!roomKey || roomKey.trials + 1 >= MAX_TRIALS) {
      const newRoomKey = await createRoomKey(reservation);
      await sendRoomKeyMail(reservation, newRoomKey.key, await toDataURL(encryptQrInfo({
        reservationId: reservation.id,
        roomId: reservation.roomId!,
        key: newRoomKey.key,
      })));
      return {
        status: 200,
        body: {
          result: false,
          message: '入室情報が再送されました。メールに記載された番号を入力してください。',
        },
      };
    }

    if (roomKey.key === key) {
      await updateRoomKey(roomKey.id, { trials: 0 });
      return checkinProcess(reservation);
    }

    await updateRoomKey(roomKey.id, {
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
  { getReservation, getRoomKey, decryptQrInfo, isValidCheckinDateRange, checkinProcess },
  async({
    getReservation,
    getRoomKey,
    decryptQrInfo,
    isValidCheckinDateRange,
    checkinProcess,
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

    const roomKey = await getRoomKey(reservation.id);
    if (roomKey?.key === info.key) {
      return checkinProcess(reservation);
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
