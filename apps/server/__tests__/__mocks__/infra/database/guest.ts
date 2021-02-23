/* istanbul ignore file */

/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import type {
  IGuestRepository,
  Guest,
  FindGuestArgs,
  CreateGuestData,
  UpdateGuestData,
} from '$/domain/database/guest';
import type { Models, Delegate } from '$/domain/database/service/types';
import { getDummyData, filterCreateData, dropObjectData } from './factory';
import { dropId } from '$/infra/database/service';

export const getDummyGuestData = (override?: Partial<CreateGuestData>): CreateGuestData => getDummyData('guest', override) as CreateGuestData;

export class TestGuestRepository implements IGuestRepository {
  private store: Guest[] = [];
  private id = 1;

  public constructor(data: CreateGuestData[] = []) {
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
    return 'guest';
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }

  create(data: CreateGuestData): Promise<Guest> {
    const guest = filterCreateData({ ...data, id: this.id++ }) as Guest;
    this.store.push(guest);
    return Promise.resolve(guest);
  }

  delete(id: number): Promise<Guest> {
    const guest = this.store.find(item => item.id === id);
    if (!guest) {
      throw new Error();
    }
    this.store = this.store.filter(item => item.id !== id);
    return Promise.resolve(guest!);
  }

  find(id: number | undefined, args?: FindGuestArgs): Promise<Guest> | never {
    const guest = this.store.find(item => item.id === id);
    if (!guest) {
      if (args?.rejectOnNotFound === false) {
        return Promise.resolve(null) as any;
      }
      throw new Error();
    }
    return Promise.resolve(guest);
  }

  list(): Promise<Guest[]> {
    return Promise.resolve(this.store);
  }

  update(id: number, data: UpdateGuestData): Promise<Guest> {
    if (!this.store.find(item => item.id === id)) {
      throw new Error();
    }
    this.store = this.store.map(item => item.id === id ? {
      ...item,
      ...dropObjectData(dropId(data)),
    } as Guest : item);
    return Promise.resolve(this.store.find(item => item.id === id)!);
  }

  deleteMany(): Promise<{ count: number }> {
    return Promise.resolve({ count: 0 });
  }
}

export const getGuest = (override?: Partial<CreateGuestData>): Promise<Guest> => (new TestGuestRepository()).create(getDummyGuestData(override));
