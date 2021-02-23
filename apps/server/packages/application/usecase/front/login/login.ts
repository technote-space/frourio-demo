import type { IGuestRepository } from '$/packages/domain/database/guest';
import type { IResponseRepository } from '$/packages/domain/http/response';
import type { FastifyInstance } from 'fastify';
import type { Auth0Body } from './validators';
import { singleton, inject } from 'tsyringe';
import { depend } from 'velona';
import { verifyCode } from '$/packages/application/service/auth0';
import { createGuestAuthorizationPayload } from '$/packages/application/service/auth';

@singleton()
export class LoginUseCase {
  public constructor(@inject('IGuestRepository') private repository: IGuestRepository, @inject('IResponseRepository') private response: IResponseRepository) {
  }

  execute = depend(
    { createGuestAuthorizationPayload, verifyCode },
    async({ createGuestAuthorizationPayload, verifyCode }, body: Auth0Body, fastify: FastifyInstance) => {
      const info = await verifyCode(body.accessToken);
      if (!info) {
        return this.response.unauthorized();
      }

      const guests = await this.repository.list({
        where: {
          OR: [
            { email: info.email },
            { auth0Sub: info.auth0Sub },
          ],
        },
      });
      let guest: { id: number };
      if (guests.length) {
        guest = guests[0];
        await this.repository.update(guest.id, {
          // merge
          ...guests.reduce((acc, guest) => {
            Object.keys(guest).filter(key => key !== 'createdAt' && key !== 'updatedAt').forEach(key => {
              acc[key] = acc[key] || guest[key];
            });
            return acc;
          }, {}),
          email: info.email,
          auth0Sub: info.auth0Sub,
        });
        if (guests.length > 1) {
          await this.repository.deleteMany(guests.slice(1).map(guest => guest.id));
        }
      } else {
        guest = await this.repository.create({
          email: info.email,
          auth0Sub: info.auth0Sub,
        });
      }

      return this.response.login(fastify.jwt.sign(createGuestAuthorizationPayload(guest.id)));
    },
  );
}
