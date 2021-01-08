import { depend } from 'velona';
import { validateUser } from '$/repositories/admin';
import { createAuthorizationPayload } from '$/service/auth';
import type { LoginBody } from '$/domains/login/validators';
import type { FastifyInstance } from 'fastify';
import type { LoginResponse } from '$/types';
import 'fastify-jwt';

export const login = depend(
  { createAuthorizationPayload, validateUser },
  async(
    { createAuthorizationPayload, validateUser },
    body: LoginBody,
    fastify: FastifyInstance,
  ): Promise<LoginResponse> => {
    const id = await validateUser(body.email, body.pass);
    if (id === undefined) {
      return { status: 401 };
    }

    return {
      status: 204,
      headers: { authorization: fastify.jwt.sign(await createAuthorizationPayload(id)) },
    };
  },
);
