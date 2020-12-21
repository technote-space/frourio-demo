import createError from 'fastify-error';
import bcrypt from 'bcryptjs';
import { getAdmin } from '$/repositories/admin';
import type { FastifyRequest } from 'fastify';
import type { AuthorizationPayload } from '$/types';

export const ensureNotNull = <T>(item: T | null, errorMessage = 'Not Found'): T | never => {
  if (!item) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw new createError('FST_TARGET_NOT_FOUND', errorMessage, 404);
  }

  return item;
};

export const getSkip = (perPage: number, page?: number): number => ((page ?? 1) - 1) * perPage;

export const createHash   = (data: string): string => bcrypt.hashSync(data, 10);
export const validateHash = (data: string, hash: string): boolean => bcrypt.compareSync(data, hash);

export const createAuthorizationPayload = async(id: number): Promise<AuthorizationPayload> => {
  return {
    id,
    roles: ((await getAdmin(id)).roles ?? '').split('|'),
  };
};
export const verifyAdmin                = async(request: FastifyRequest, roles?: string[]): Promise<void> => {
  const payload = await request.jwtVerify() as AuthorizationPayload;
  if (!payload.id || (roles?.length && (!payload.roles.length || roles.some(role => !payload.roles.includes(role))))) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    throw new createError('FST_UNAUTHORIZED', 'Unauthorized', 401);
  }
};
