import { depend } from 'velona';
import { getAdmin } from '$/repositories/admin';
import type { BodyResponse, AdminAuthorizationPayload } from '$/types';
import type { Admin } from '$/repositories/admin';

export const get = depend(
  { getAdmin },
  async({ getAdmin }, user: AdminAuthorizationPayload): Promise<BodyResponse<Admin>> => ({
    status: 200,
    body: await getAdmin(user.id),
  }),
);
