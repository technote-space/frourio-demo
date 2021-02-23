import type { IAdminRepository } from '$/domain/database/admin';
import type { IResponseRepository } from '$/domain/http/response';
import type { LoginBody } from './validators';
import type { FastifyInstance } from 'fastify';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { createAdminAuthorizationPayload } from '$/application/service/auth';
import 'fastify-jwt';

@singleton()
export class LoginUseCase {
  public constructor(@inject('IAdminRepository') private repository: IAdminRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  execute = depend(
    { createAdminAuthorizationPayload },
    async({ createAdminAuthorizationPayload }, body: LoginBody, fastify: FastifyInstance) => {
      const id = await this.repository.validate(body.email, body.pass);
      if (undefined === id) {
        return this.response.unauthorized();
      }

      return this.response.login(fastify.jwt.sign(createAdminAuthorizationPayload(await this.repository.find(id))));
    },
  );
}
