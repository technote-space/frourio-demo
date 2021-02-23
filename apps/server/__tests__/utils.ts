/* istanbul ignore file */

import type { FastifyInstance } from 'fastify';
import type { SignPayloadType } from 'fastify-jwt';
import type { Query } from '@technote-space/material-table';
import Fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';

export const getFastify = (): FastifyInstance => {
  const fastify = Fastify();
  fastify.register(fastifyJwt, { secret: 'test secret' });

  fastify.jwt = {
    ...fastify.jwt,
    sign: jest.fn((payload: SignPayloadType) => JSON.stringify(payload)),
    // decode: jest.fn((token: string) => JSON.parse(token)),
  };

  return fastify;
};

export const getAuthorizationHeader = (id: number, roles: string[] = []) => ({
  authorization: JSON.stringify({ id, roles }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPromiseLikeItem = (item: any): any => Promise.resolve(item);

export const testEnv = (): void => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });
};

type GetQueryOptions = {
  filters?: Record<string, any>;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  search?: string;
  orderBy: string;
  orderDirection?: 'asc' | 'desc';
}
export const getQuery = <RowData extends object>({
  filters,
  page,
  pageSize,
  totalCount,
  search,
  orderBy,
  orderDirection,
}: GetQueryOptions): Query<RowData> => ({
  filters: Object.entries(filters ?? {}).map(([field, value]) => ({
    column: { field },
    operator: '=',
    value,
  })),
  page: page ?? 1,
  pageSize: pageSize ?? 10,
  totalCount: totalCount ?? 100,
  search: search ?? 'test',
  orderBy: {
    field: orderBy,
  },
  orderDirection: orderDirection ?? 'asc',
});
