import { depend } from 'velona';
import { getGuest } from '$/repositories/guest';
import type { BodyResponse, GuestAuthorizationPayload } from '$/types';
import type { Guest } from '$/repositories/guest';

export const get = depend(
  { getGuest },
  async({ getGuest }, user: GuestAuthorizationPayload): Promise<BodyResponse<Guest>> => ({
    status: 200,
    body: await getGuest(user.id),
  }),
);
