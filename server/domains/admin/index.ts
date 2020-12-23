import { depend } from 'velona';
import { getAdmin } from '$/repositories/admin';
import type { FastifyInstance } from 'fastify';
import type { BodyResponse, AuthorizationPayload } from '$/types';
import type { Admin } from '$/repositories/admin';

export const get = depend(
  { getAdmin },
  async({ getAdmin }, fastify: FastifyInstance): Promise<BodyResponse<Admin>> => ({
    status: 200,
    body: await getAdmin((fastify.requestContext.get('user') as AuthorizationPayload).id),
  }),
);
