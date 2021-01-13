import type { FastifyRequest } from 'fastify';
import type { AuthorizationPayload } from '$/types';
import { depend } from 'velona';
import bcrypt from 'bcryptjs';
import { getAdmin } from '$/repositories/admin';
import 'fastify-jwt';

export const createHash = (data: string): string => bcrypt.hashSync(data, 10);
export const validateHash = (data: string, hash: string): boolean => bcrypt.compareSync(data, hash);

export const createAuthorizationPayload = depend(
  { getAdmin },
  async({ getAdmin }, id: number): Promise<AuthorizationPayload> => ({
    id,
    roles: ((await getAdmin(id)).roles ?? '').split('|'),
  }),
);
export const verifyAdmin = async(request: FastifyRequest, roles?: string[]): Promise<boolean> => {
  if (request.url === '/api/login' && request.method === 'POST') {
    // ディレクトリレベルのフックは上書きできないようなのでここで除外
    //
    // https://frourio.io/docs/hooks/directory-level-hooks
    // > Directory-level hooks are cascading
    return true;
  }

  const payload = await request.jwtVerify() as AuthorizationPayload;
  if (!payload.id || (roles?.length && (!payload.roles.length || roles.some(role => !payload.roles.includes(role))))) {
    return false;
  }

  return true;
};