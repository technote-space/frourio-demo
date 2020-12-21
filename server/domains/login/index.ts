import { depend } from 'velona';
import { validateUser } from '$/repositories/admin';
import { createAuthorizationPayload } from '$/utils';
import type { LoginBody } from '$/domains/login/validators';
import type { FastifyInstance } from 'fastify';
import type { BasicResponse } from '$/types';

export const login = depend(
  { createAuthorizationPayload },
  async({ createAuthorizationPayload }, body: LoginBody, fastify: FastifyInstance): Promise<BasicResponse> => {
    const id = await validateUser(body.email, body.pass);
    if (id === undefined) {
      return { status: 401 };
    }

    return {
      status: 201,
      headers: { authorization: fastify.jwt.sign(await createAuthorizationPayload(id)) },
    };
  },
);
