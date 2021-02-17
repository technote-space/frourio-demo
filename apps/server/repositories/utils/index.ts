/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any */
import type { Prisma, PrismaClient } from '$/prisma/client';
import type { Column, Query, Filter } from '@technote-space/material-table';
import type { MaybeUndefined } from '@frourio-demo/types';
import type { Multipart } from 'fastify-multipart';
import bcrypt from 'bcryptjs';
import { startOfDay, addDays } from 'date-fns';

export type Models = {
  [key in keyof PrismaClient]: PrismaClient[key] extends {
    findUnique,
    findMany,
    findFirst,
    create,
    update,
    updateMany,
    upsert,
    delete,
    deleteMany,
    count,
  } ? key : never
}[keyof PrismaClient]
type ModelWhere<T extends object> = {
  [key in keyof T]?: T[key] extends undefined ? never :
    T[key] extends number ? (Prisma.IntFilter | number) :
      T[key] extends string ? (Prisma.StringFilter | string) :
        T[key] extends Date ? (Prisma.DateTimeFilter | Date | string) :
          never
};
type ModelWhereSub<T extends object> = ModelWhere<T> | {
  AND?: Prisma.Enumerable<ModelWhereSub<T> & ModelWhere<T>>;
  OR?: Prisma.Enumerable<ModelWhereSub<T> & ModelWhere<T>>;
  NOT?: Prisma.Enumerable<ModelWhereSub<T> & ModelWhere<T>>;
};

type RelationFilterWhereInput = {
  AND?: Prisma.Enumerable<RelationFilterWhereInput & {
    [key: string]: any;
  }>;
  OR?: Prisma.Enumerable<RelationFilterWhereInput & {
    [key: string]: any;
  }>;
  NOT?: Prisma.Enumerable<RelationFilterWhereInput & {
    [key: string]: any;
  }>;
} & {
  [key: string]: any;
};
type RelationFilterWhere = {
  every?: RelationFilterWhereInput;
  some?: RelationFilterWhereInput;
  none?: RelationFilterWhereInput;
};
type RelationFilterWhereSub<T extends object> = {
  [key in keyof T]?: T[key] extends undefined ? never :
    T[key] extends {}[] ? RelationFilterWhere :
      never;
};

type Where<T extends object> = {
  AND: Array<ModelWhereSub<T> | RelationFilterWhereSub<T>>;
};
type OrderBy<T extends object> = {
  [key in keyof T]?: Prisma.SortOrder
};
type TypeKey<T, type> = {
  [key in keyof T]: NonNullable<T[key]> extends type ? key : never
}[keyof T];
type DateConstraint<T extends object> = {
  date?: Date;
  key: keyof T;
}

const mergeConstraints = <T extends object>(
  where: Where<T> | undefined,
  dateConstraint: ModelWhere<T> | undefined,
  additional: (ModelWhere<T> | RelationFilterWhereSub<T>)[],
): Where<T> | undefined => {
  if (!where) {
    if (!dateConstraint) {
      if (additional.length) {
        return {
          AND: additional,
        };
      }

      return undefined;
    }

    return {
      AND: [
        dateConstraint,
        ...additional,
      ],
    };
  }

  if (dateConstraint) {
    where.AND.push(dateConstraint);
  }

  where.AND.push(...additional);
  return where;
};

export const getFilterConstraints = <T extends object>(filters?: Filter<T>[]): ModelWhere<T>[] => {
  return (filters ?? []).filter((filter): filter is Omit<Filter<T>, 'column'> & {
    column: Omit<Column<T>, 'field'> & {
      field: keyof T
    }
  } => !!filter.column.field).map(filter => {
    if (Array.isArray(filter.value)) {
      if (filter.value.length) {
        return {
          [filter.column.field]: {
            in: filter.value,
          },
        } as ModelWhere<T>;
      }

      return undefined;
    }

    /* istanbul ignore next */
    if (filter.column.type === 'numeric') {
      /* istanbul ignore next */
      return {
        [filter.column.field]: Number(filter.value),
      } as ModelWhere<T>;
    }

    return {
      [filter.column.field]: filter.value,
    } as ModelWhere<T>;
  }).filter((filter): filter is ModelWhere<T> => !!filter);
};

export const getWhere = <T extends object>(
  search: string | undefined,
  stringKeys: TypeKey<T, string>[],
  numberKeys: TypeKey<T, number>[],
  date?: DateConstraint<T>,
  ...additional: (ModelWhere<T> | RelationFilterWhereSub<T>)[]
): Where<T> | undefined => {
  let dateConstraint;
  if (date?.date) {
    dateConstraint = { [date.key]: getDateConstraint(date.date) };
  }

  if (!search || (!stringKeys.length && !numberKeys.length)) {
    return mergeConstraints(undefined, dateConstraint, additional);
  }

  // eslint-disable-next-line no-irregular-whitespace
  const words = [...new Set(search.split(/[\s　]/).filter(word => word))];
  if (!words.length) {
    return mergeConstraints(undefined, dateConstraint, additional);
  }

  return mergeConstraints({
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
  }, dateConstraint, additional);
};

export const getOrderBy = <T extends object>(orderBy: Column<T> | undefined, orderDirection: 'asc' | 'desc' | undefined): OrderBy<T> | undefined => {
  if (!orderBy || !orderDirection || !orderBy.field) {
    return undefined;
  }

  return {
    [orderBy.field]: orderDirection,
  } as OrderBy<T>;
};

export const getDateConstraint = (date: Date) => ({
  gte: startOfDay(date),
  lt: addDays(startOfDay(date), 1),
});

export const dropId = <T extends Record<string, any> & Partial<{ id: number; code: any; }>>(data: T): Omit<T, 'id'> => {
  delete data.id;
  delete data.code;
  return data;
};

export const parseQuery = <T extends object, U extends undefined | Query<T> | any>(query: U): Query<T> | MaybeUndefined<U> => {
  if (!query) {
    return undefined as MaybeUndefined<U>;
  }

  const _query = (typeof query === 'string' ? JSON.parse(query) as Query<T> : query) as Query<T> & { 'filters[]'?: string };
  if ('filters[]' in _query && _query['filters[]']) {
    if (typeof _query['filters[]'] === 'string') {
      const filters = JSON.parse(_query['filters[]']) as Filter<T>;
      _query['filters'] = [filters];
    } else if (Array.isArray(_query['filters[]'])) {
      _query['filters'] = (_query['filters[]'] as string[]).map(filter => JSON.parse(filter)) as Filter<T>[];
    }

    delete _query['filters[]'];
  }

  if ('orderBy' in _query && typeof _query['orderBy'] === 'string') {
    _query['orderBy'] = JSON.parse(_query['orderBy']);
  }

  if ('error' in _query && typeof _query['error'] === 'string') {
    _query['error'] = JSON.parse(_query['error']);
  }

  Object.keys(_query).forEach(key => {
    if (typeof _query[key] === 'string' && /^\d{4}-\d{1,2}-\d{1,2}[\dTZ\s:.+-]*$/.test(_query[key])) {
      const date = new Date(_query[key]);
      if (!isNaN(date.getTime())) {
        _query[key] = date;
      }
    }
  });

  return _query;
};

export const isMultipartFile = (value: any): value is Multipart => {
  return typeof value === 'object' && 'filename' in value && 'toBuffer' in value;
};

export const parseBody = (body: Record<string, any>) => {
  Object.keys(body).forEach(key => {
    if (typeof body[key] === 'string' && /^\{[\s\S]*\}$/.test(body[key])) {
      try {
        body[key] = JSON.parse(body[key]);
      } catch {
        //
      }
    } else if (body[key] && typeof body[key] === 'object' && !isMultipartFile(body[key])) {
      body[key] = parseBody(body[key]);
    }
  });

  return body;
};

export const createHash = (data: string): string => bcrypt.hashSync(data, 10);
export const validateHash = (data: string, hash: string): boolean => bcrypt.compareSync(data, hash);
export const createAdminPasswordHash = <T extends Prisma.StringFieldUpdateOperationsInput | string | undefined>(password?: T): string | MaybeUndefined<T> => {
  if (password && typeof password === 'object') {
    return createAdminPasswordHash(password.set);
  }

  if (!password) {
    return undefined as MaybeUndefined<T>;
  }

  return createHash(password as string);
};

export const whereId = (id: number | undefined): { id?: number } => ({
  ...(id ? { id } : undefined),
});