/* eslint-disable @typescript-eslint/no-explicit-any */
import Faker from 'faker';
import type { PrismaClient } from '../client';
import { getDefines } from './define';

Faker.locale = 'ja';

export type DelegateTypes = {
  [key in keyof PrismaClient]: PrismaClient[key] extends {
    findMany;
    create;
    deleteMany;
  } ? key : never
}[keyof PrismaClient]

export class Factory<T, U> {
  constructor(private prisma: PrismaClient, private type: DelegateTypes) {
  }

  public async clear(): Promise<Factory<T, U>> {
    const deleteMany = this.prisma[this.type].deleteMany as (any) => Promise<any>;
    await deleteMany({ where: {} });
    return this;
  }

  public async create(override?: Partial<U>, ...params: any[]): Promise<T> {
    const create = this.prisma[this.type].create as (any) => Promise<any>;
    return create({
      data: {
        ...getDefines()[this.type](Faker, params),
        ...override,
      } as U,
    });
  }

  public async createMany(number: number, override?: Partial<U>, ...params: any[]): Promise<FactoryItems<T>> {
    return new FactoryItems<T>(await [...Array(number)].reduce(async prev => {
      const acc = await prev;
      return acc.concat(await this.create(override, ...params));
    }, Promise.resolve([] as T[])));
  }

  public async list(): Promise<FactoryItems<T>> {
    const findMany = this.prisma[this.type].findMany as () => Promise<Array<any>>;
    return new FactoryItems<T>(await findMany());
  }
}

export class FactoryItems<T> {
  constructor(private items: Array<T>) {
  }

  public async each(callback: (item: T) => Promise<void>) {
    await this.items.reduce(async(prev, item) => {
      await prev;
      await callback(item);
    }, Promise.resolve());
  }

  public random(): T {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }
}

export const factory = <T, U = undefined>(prisma: PrismaClient, type: DelegateTypes): Factory<T, U> => {
  return new Factory<T, U>(prisma, type);
};
