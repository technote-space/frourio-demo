import { depend } from 'velona';
import { getAdmin, getAdminId } from '$/repositories/admin';
import type { FastifyInstance } from 'fastify';
import type { AuthHeader, BodyResponse } from '$/types';
import type { Admin } from '$/repositories/admin';

export const get = depend(
  { getAdmin, getAdminId },
  async({ getAdmin, getAdminId }, headers: AuthHeader, fastify: FastifyInstance): Promise<BodyResponse<Admin>> => ({
    status: 200,
    body: await getAdmin(await getAdminId(headers, fastify)),
  }),
);
