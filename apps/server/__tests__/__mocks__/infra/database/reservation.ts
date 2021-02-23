/* istanbul ignore file */

/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import type {
  IReservationRepository,
  Reservation,
  FindReservationArgs,
  SearchReservationArgs,
  CreateReservationData,
  UpdateReservationData,
} from '$/domain/database/reservation';
import type { Room, CreateRoomData } from '$/domain/database/room';
import type { Guest, CreateGuestData } from '$/domain/database/guest';
import type { Models, Delegate } from '$/domain/database/service/types';
import { getDummyData, filterCreateData, dropObjectData } from './factory';
import { dropId } from '$/infra/database/service';

export const getDummyReservationData = (
  room: CreateRoomData | Room,
  guest: CreateGuestData | Guest,
  override?: Partial<CreateReservationData & { code: string }>,
): CreateReservationData => getDummyData('reservation', {
  status: 'checkin',
  payment: 10000,
  ...override,
}, room, guest) as CreateReservationData;

export class TestReservationRepository implements IReservationRepository {
  private store: Reservation[] = [];
  private id = 1;

  public constructor(data: CreateReservationData[] = []) {
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
    return 'reservation';
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }

  create(data: CreateReservationData): Promise<Reservation> {
    const reservation = filterCreateData({
      ...data,
      id: this.id++,
      ...(data.guest?.connect?.id ? {guestId: data.guest.connect.id} : {}),
      ...(data.room?.connect?.id ? {roomId: data.room.connect.id} : {}),
    }) as Reservation;
    this.store.push(reservation);
    return Promise.resolve(reservation);
  }

  delete(id: number): Promise<Reservation> {
    const reservation = this.store.find(item => item.id === id);
    if (!reservation) {
      throw new Error();
    }
    this.store = this.store.filter(item => item.id !== id);
    return Promise.resolve(reservation!);
  }

  find(id: number | undefined, args?: FindReservationArgs): Promise<Reservation> | never {
    const reservation = this.store.find(item => item.id === id);
    if (!reservation) {
      if (args?.where?.code) {
        const reservation = this.store.find(item => item.code === args.where?.code);
        if (reservation) {
          return Promise.resolve(reservation);
        }
      }
      if (args?.rejectOnNotFound === false) {
        return Promise.resolve(null) as any;
      }
      throw new Error();
    }
    return Promise.resolve(reservation);
  }

  list(args?: SearchReservationArgs): Promise<Reservation[]> {
    return Promise.resolve(this.store.filter(item =>
      (!args?.where?.roomId || args.where.roomId === item.roomId) &&
      (!args?.where?.guestId || args.where.guestId === item.guestId),
    ));
  }

  update(id: number, data: UpdateReservationData): Promise<Reservation> {
    if (!this.store.find(item => item.id === id)) {
      throw new Error();
    }
    this.store = this.store.map(item => item.id === id ? {
      ...item,
      ...dropObjectData(dropId(data)),
    } as Reservation : item);
    return Promise.resolve(this.store.find(item => item.id === id)!);
  }
}

export const getReservation = (
  room: CreateRoomData | Room,
  guest: CreateGuestData | Guest,
  override?: Partial<CreateReservationData & { code: string }>,
): Promise<Reservation> => (new TestReservationRepository()).create(getDummyReservationData(room, guest, override));
