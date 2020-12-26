import Fastify from 'fastify';
import fastifyJwt from 'fastify-jwt';
import { fastifyRequestContextPlugin } from 'fastify-request-context';
import type { FastifyInstance } from 'fastify';
import type { SignPayloadType } from 'fastify-jwt';
import type { AuthorizationPayload } from '../types';

export const getFastify = (user?: AuthorizationPayload): FastifyInstance => {
  const context = { user };
  const fastify = Fastify();
  fastify.register(fastifyJwt, { secret: 'test secret' });
  fastify.register(fastifyRequestContextPlugin);

  fastify.jwt            = {
    ...fastify.jwt,
    sign: jest.fn((payload: SignPayloadType) => JSON.stringify(payload)),
    decode: jest.fn((token: string) => JSON.parse(token)),
  };
  fastify.requestContext = {
    ...fastify.requestContext,
    set: jest.fn((key: string, value: any) => context[key] = value),
    get: jest.fn((key: string) => context[key]),
  };

  return fastify;
};

export const getAuthorizationHeader = (id: number, roles: string[] = []) => ({
  authorization: JSON.stringify({ id, roles }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPromiseLikeItem = (item: { [key: string]: any }): any => Promise.resolve(item);
