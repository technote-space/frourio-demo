import type { Auth0Body } from './validators';
import type { FastifyInstance } from 'fastify';
import type { LoginResponse } from '$/types';
import { depend } from 'velona';
import { verifyCode } from '$/service/auth0';
import { createGuestAuthorizationPayload } from '$/service/auth';
import { getGuests, createGuest, updateGuest, deleteGuests } from '$/repositories/guest';
import 'fastify-jwt';

export const login = depend(
  { createGuestAuthorizationPayload, verifyCode, getGuests, createGuest, updateGuest, deleteGuests },
  async(
    { createGuestAuthorizationPayload, verifyCode, getGuests, createGuest, updateGuest, deleteGuests },
    body: Auth0Body,
    fastify: FastifyInstance,
  ): Promise<LoginResponse> => {
    const info = await verifyCode(body.accessToken);
    if (!info) {
      return { status: 401 };
    }

    const guests = await getGuests({
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
      await updateGuest(guest.id, {
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
        await deleteGuests(guests.slice(1).map(guest => guest.id));
      }
    } else {
      guest = await createGuest({
        email: info.email,
        auth0Sub: info.auth0Sub,
      });
    }

    return {
      status: 204,
      headers: { authorization: fastify.jwt.sign(createGuestAuthorizationPayload(guest.id)) },
    };
  },
);
