import type { FastifyRequest } from 'fastify';
import type { Admin } from '$/domain/database/admin';
import type { Role } from '$/domain/database/role';
import { startWithUppercase } from '@frourio-demo/utils/string';
import 'fastify-jwt';

export type AdminAuthorizationPayload = {
  id: number;
  roles: string[];
};

export type GuestAuthorizationPayload = {
  id: number;
};

export const createAdminAuthorizationPayload = (admin: Admin): AdminAuthorizationPayload => ({
  id: admin.id,
  roles: admin.roles.map(role => role.role),
});
export const createGuestAuthorizationPayload = (id: number): GuestAuthorizationPayload => ({
  id,
});

const getRole = (domain: string, method: string, hasParams?: boolean): string => {
  switch (method.trim().toLocaleUpperCase()) {
    case 'GET':
      if (hasParams) {
        return `${domain}_detail`;
      }

      return domain;
    case 'POST':
      return `${domain}_create`;
    case 'PATCH':
      return `${domain}_update`;
    case 'DELETE':
      return `${domain}_delete`;
    /* istanbul ignore next */
    default:
      /* istanbul ignore next */
      return domain;
  }
};
const getRoles = (request: FastifyRequest, domain: string | undefined): string[] => {
  if (!domain) {
    return [];
  }

  const roles = [domain];
  roles.push(getRole(domain, request.method, !!request.params && typeof request.params === 'object' && !!Object.keys(request.params as {}).length));

  return [...new Set(roles)];
};
export const verifyAdmin = async(request: FastifyRequest, domain?: string): Promise<boolean> => {
  if (request.url === '/api/admin/login' && request.method === 'POST') {
    return true;
  }

  const roles = getRoles(request, domain);
  try {
    const payload = await request.jwtVerify() as AdminAuthorizationPayload | null;
    if (!payload?.id || (roles.length && (!payload.roles.length || roles.some(role => !payload.roles.includes(role))))) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};
export const verifyGuest = async(request: FastifyRequest): Promise<boolean> => {
  try {
    const payload = await request.jwtVerify() as GuestAuthorizationPayload | null;
    if (!payload?.id) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

type Crud = 'create' | 'read' | 'update' | 'delete' | 'all';
export const getRolesValue = (settings: { domain: string, targets: Crud[] }[]): Role[] => {
  const roles: Role[] = [];
  settings.forEach(setting => {
    const domain = setting.domain.replace(/[\s-.]+/g, '_');
    const label = startWithUppercase(domain).replace('_', ' ');
    roles.push({ role: domain, name: label });
    setting.targets.forEach(target => {
      if (target === 'create' || target === 'all') {
        roles.push({ role: getRole(domain, 'post'), name: `Create in ${label}` });
      }
      if (target === 'read' || target === 'all') {
        roles.push({ role: getRole(domain, 'get', true), name: `Get detail in ${label}` });
      }
      if (target === 'update' || target === 'all') {
        roles.push({ role: getRole(domain, 'patch'), name: `Update in ${label}` });
      }
      if (target === 'delete' || target === 'all') {
        roles.push({ role: getRole(domain, 'delete'), name: `Delete in ${label}` });
      }
    });
  });

  return roles;
};
