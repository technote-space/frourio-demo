/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import type { Query, QueryResult, Column, Filter } from '@technote-space/material-table';
import type { MaybeUndefined } from '@frourio-demo/types';
import type { AdditionalWhere, TypeKey, DateConstraint, Where, OrderBy } from '$/domain/database/service/types';
import type { ModelWhere, RelationFilterWhereSub } from '$/domain/database/service/types';
import { addDays, startOfDay } from 'date-fns';
import { getSkip, getCurrentPage } from './pages';

export const getDateConstraint = (date: Date) => ({
  gte: startOfDay(date),
  lt: addDays(startOfDay(date), 1),
});

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

interface IRepository<T extends object> {
  count(args?: { where }): Promise<number>;

  list(args?: { skip: number; take: number; where?: Where<T>; orderBy?: OrderBy<T>; include?: Record<string, any>; }): Promise<T[]>;
}
export const execute = async <T extends object, U extends Partial<T>>(
  repository: IRepository<T>,
  query: Query<U>,
  stringKeys: TypeKey<T, string>[],
  numberKeys: TypeKey<T, number>[],
  args?: Record<string, any>,
  date?: DateConstraint<T>,
  ...additional: AdditionalWhere<T>[]
): Promise<QueryResult<U>> => {
  const pageSize = query.pageSize;
  const where = getWhere<T>(query.search, stringKeys, numberKeys, date, ...additional);
  const orderBy = getOrderBy<U>(query.orderBy, query.orderDirection);
  const totalCount = await repository.count({ where });
  const page = getCurrentPage(pageSize, totalCount, query.page);
  const data = await repository.list({
    skip: getSkip(pageSize, page),
    take: pageSize,
    where,
    orderBy,
    ...args,
  }) as Partial<T>[];

  return { data: data as U[], page, totalCount };
};

export const converter = <T extends object, U extends T>(
  convert: (data: T) => U,
  { data, page, totalCount }: QueryResult<T>,
): QueryResult<U> => {
  return {
    data: data.map(convert),
    page,
    totalCount,
  };
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
