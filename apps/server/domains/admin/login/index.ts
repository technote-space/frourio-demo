import type { LoginBody } from './validators';
import type { FastifyInstance } from 'fastify';
import type { LoginResponse } from '$/types';
import { depend } from 'velona';
import { validateUser } from '$/repositories/admin';
import { createAdminAuthorizationPayload } from '$/service/auth';
import 'fastify-jwt';

export const login = depend(
  { createAdminAuthorizationPayload, validateUser },
  async(
    { createAdminAuthorizationPayload, validateUser },
    body: LoginBody,
    fastify: FastifyInstance,
  ): Promise<LoginResponse> => {
    const id = await validateUser(body.email, body.pass);
    if (id === undefined) {
      return { status: 401 };
    }

    return {
      status: 204,
      headers: { authorization: fastify.jwt.sign(await createAdminAuthorizationPayload(id)) },
    };
  },
);
