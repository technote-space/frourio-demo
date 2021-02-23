/* istanbul ignore file */

import type {
  IRoomKeyRepository,
  RoomKey,
  CreateRoomKeyData,
  UpdateRoomKeyData,
} from '$/packages/domain/database/roomKey';
import type { Reservation } from '$/prisma/client';
import { set } from 'date-fns';
import { generateRoomKey, dropId } from '$/packages/infra/database/service';
import { getDummyData, filterCreateData, dropObjectData } from './factory';

export const getDummyRoomKeyData = (override?: Partial<CreateRoomKeyData>): CreateRoomKeyData => getDummyData('roomKey', override) as CreateRoomKeyData;

export class TestRoomKeyRepository implements IRoomKeyRepository {
  private store: RoomKey[] = [];
  private id = 1;

  create(reservation: Reservation, data?: CreateRoomKeyData): Promise<RoomKey> {
    const values = { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 };
    const roomKey = filterCreateData({
      ...{
        reservationId: reservation.id,
        key: generateRoomKey(),
        trials: 0,
        startAt: set(reservation.checkin, values),
        endAt: set(reservation.checkout, values),
        ...data,
      }, id: this.id++,
    }) as RoomKey;
    this.store.push(roomKey);
    return Promise.resolve(roomKey);
  }

  find(id: number): Promise<RoomKey> | never {
    const roomKey = this.store.find(item => item.reservationId === id);
    if (!roomKey) {
      throw new Error();
    }
    return Promise.resolve(roomKey);
  }

  update(id: number, data: UpdateRoomKeyData): Promise<RoomKey> {
    if (!this.store.find(item => item.id === id)) {
      throw new Error();
    }
    this.store = this.store.map(item => item.id === id ? {
      ...item,
      ...dropObjectData(dropId(data)),
    } as RoomKey : item);
    return Promise.resolve(this.store.find(item => item.id === id)!);
  }
}
