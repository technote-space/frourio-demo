/* eslint-disable @typescript-eslint/ban-types */
import type { Prisma, PrismaClient } from '@prisma/client';
import { Column } from 'material-table';

export type Models = {
  [key in keyof PrismaClient]: PrismaClient[key] extends {
    findUnique,
    findFirst,
    findMany,
    create,
    delete,
    update,
    deleteMany,
    updateMany,
    upsert,
    findOne,
    count,
  } ? key : never
}[keyof PrismaClient]

type ModelWhere<T extends object> = {
  [key in keyof T]?: T[key] extends number ? (Prisma.IntFilter | number) :
    T[key] extends string ? (Prisma.StringFilter | string) :
      T[key] extends Date ? (Prisma.DateTimeFilter | Date | string) :
        never
};
type Where<T extends object> = ModelWhere<T> | {
  AND?: Prisma.Enumerable<Where<T>>;
  OR?: Prisma.Enumerable<Where<T>>;
  NOT?: Prisma.Enumerable<Where<T>>;
};
type OrderBy<T extends object> = {
  [key in keyof T]?: Prisma.SortOrder
};
type TypeKey<T, type> = {
  [key in keyof T]: NonNullable<T[key]> extends type ? key : never
}[keyof T];

export const getWhere = <T extends object>(search: string | undefined, stringKeys: TypeKey<T, string>[], numberKeys: TypeKey<T, number>[]): Where<T> | undefined => {
  if (!search) {
    return undefined;
  }

  if (!stringKeys.length && !numberKeys.length) {
    return undefined;
  }

  const words = [...new Set(search.split(' ').filter(word => word))];
  if (!words.length) {
    return undefined;
  }

  return {
    AND: words.map(word => {
      const conditions: ModelWhere<T>[] = [];
      if (numberKeys.length && /^\d+$/.test(word)) {
        conditions.push(...numberKeys.map(key => ({
          [key]: Number(word),
        } as ModelWhere<T>)));
      }
      conditions.push(...stringKeys.map(key => ({
        [key]: {
          contains: word,
        },
      } as ModelWhere<T>)));

      return {
        OR: conditions,
      };
    }),
  };
};

export const getOrderBy = <T extends object>(_orderBy: Column<T> | undefined, orderDirection: 'asc' | 'desc' | undefined): OrderBy<T> | undefined => {
  const orderBy = typeof _orderBy === 'string' ? JSON.parse(_orderBy) : _orderBy;
  if (!orderBy || !orderDirection || !orderBy.field) {
    return undefined;
  }

  return {
    [orderBy.field]: orderDirection,
  };
};

export const dropId = <T extends Record<string, any> & Partial<{ id: number }>>(data: T): Omit<T, 'id'> => {
  delete data.id;
  return data;
};
