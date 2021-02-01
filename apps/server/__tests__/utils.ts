import Fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import type { FastifyInstance } from 'fastify';
import type { SignPayloadType } from 'fastify-jwt';

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
