/* istanbul ignore file */

/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import type {
  IRoomRepository,
  Room,
  FindRoomArgs,
  CreateRoomData,
  UpdateRoomData,
} from '$/domain/database/room';
import type { Models, Delegate } from '$/domain/database/service/types';
import { getDummyData, filterCreateData, dropObjectData } from './factory';
import { dropId } from '$/infra/database/service';

export const getDummyRoomData = (override?: Partial<CreateRoomData>): CreateRoomData => getDummyData('room', override) as CreateRoomData;

export class TestRoomRepository implements IRoomRepository {
  private store: Room[] = [];
  private id = 1;

  public constructor(data: CreateRoomData[] = []) {
    data.forEach(data => {
      this.create(data).then();
    });
  }

  getDelegate(): Delegate {
    const _store = this.store;
    return {
      findFirst(): Promise<object | null> {
        return Promise.resolve(_store.find(() => true) ?? null);
      },
    };
  }

  getModelName(): Models {
    return 'room';
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }

  create(data: CreateRoomData): Promise<Room> {
    const room = filterCreateData({ ...data, id: this.id++ }) as Room;
    this.store.push(room);
    return Promise.resolve(room);
  }

  delete(id: number): Promise<Room> {
    const room = this.store.find(item => item.id === id);
    if (!room) {
      throw new Error();
    }
    this.store = this.store.filter(item => item.id !== id);
    return Promise.resolve(room!);
  }

  find(id: number | undefined, args?: FindRoomArgs): Promise<Room> | never {
    const room = this.store.find(item => item.id === id);
    if (!room) {
      if (args?.rejectOnNotFound === false) {
        return Promise.resolve(null) as any;
      }
      throw new Error();
    }
    return Promise.resolve(room);
  }

  list(): Promise<Room[]> {
    return Promise.resolve(this.store);
  }

  update(id: number, data: UpdateRoomData): Promise<Room> {
    if (!this.store.find(item => item.id === id)) {
      throw new Error();
    }
    this.store = this.store.map(item => item.id === id ? {
      ...item,
      ...dropObjectData(dropId(data)),
    } as Room : item);
    return Promise.resolve(this.store.find(item => item.id === id)!);
  }
}

export const getRoom = (override?: Partial<CreateRoomData>): Promise<Room> => (new TestRoomRepository()).create(getDummyRoomData(override));
