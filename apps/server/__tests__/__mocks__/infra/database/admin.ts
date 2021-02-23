/* istanbul ignore file */

/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import type {
  IAdminRepository,
  Admin,
  CreateAdminData,
  UpdateAdminData,
} from '$/domain/database/admin';
import type { Models, Delegate } from '$/domain/database/service/types';
import { getDummyData, filterCreateData, dropObjectData } from './factory';
import { dropId } from '$/infra/database/service';

export const getDummyAdminData = (override?: Partial<CreateAdminData>): CreateAdminData => getDummyData('admin', override) as CreateAdminData;

export class TestAdminRepository implements IAdminRepository {
  private store: Admin[] = [];
  private id = 1;

  public constructor(data: CreateAdminData[] = []) {
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
    return 'admin';
  }

  count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }

  create(data: CreateAdminData): Promise<Admin> {
    const admin = filterCreateData({ ...data, id: this.id++ }) as Admin;
    this.store.push(admin);
    return Promise.resolve(admin);
  }

  delete(id: number): Promise<Admin> {
    const admin = this.store.find(item => item.id === id);
    if (!admin) {
      throw new Error();
    }
    this.store = this.store.filter(item => item.id !== id);
    return Promise.resolve(admin);
  }

  find(id: number): Promise<Admin> | never {
    const admin = this.store.find(item => item.id === id);
    if (!admin) {
      throw new Error();
    }
    return Promise.resolve(admin);
  }

  list(): Promise<Admin[]> {
    return Promise.resolve(this.store);
  }

  update(id: number, data: UpdateAdminData): Promise<Admin> {
    if (!this.store.find(item => item.id === id)) {
      throw new Error();
    }
    this.store = this.store.map(item => item.id === id ? {
      ...item,
      ...dropObjectData(dropId(data)),
    } as Admin : item);
    return Promise.resolve(this.store.find(item => item.id === id)!);
  }

  validate(email: string): Promise<number | undefined> {
    const admin = this.store.find(item => item.email === email);
    return Promise.resolve(admin ? admin.id : undefined);
  }
}

export const getAdmin = (override?: Partial<CreateAdminData>): Promise<Admin> => (new TestAdminRepository()).create(getDummyAdminData(override));