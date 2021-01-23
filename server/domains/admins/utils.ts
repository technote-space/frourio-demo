import type { Admin } from '$/repositories/admin';
import type { Role } from '$/repositories/role';
import type { SavedFileType } from '$/service/multipart';
import type { Filter } from '@technote-space/material-table';
import { saveFile } from '$/service/multipart';
import { getFilterConstraints } from '$/repositories/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CheckPassword<T extends Record<string, any>> =
  T extends { id: number } ? (T & { password?: string }) : (T & { password: string });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProcessRoleType<T extends Record<string, any> & { roles?: Role[] }> = {
  [key in keyof T]: key extends 'roles' ? { connect: { role: string }[] } : T[key]
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processRoleConnections = <T extends Record<string, any> & { roles?: Role[] }>(data: T): ProcessRoleType<T> => {
  return {
    ...data,
    roles: {
      connect: (data.roles ?? []).map(role => ({ role: role.role })),
    },
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processBody = async <T extends Record<string, any> & { roles?: Role[] }>(body: T) =>
  saveFile(processRoleConnections(body)) as Promise<CheckPassword<SavedFileType<ProcessRoleType<T>>>>;

export const getAdminFilterConstraints = (filters?: Filter<Admin>[]) => {
  if (!filters?.length) {
    return [];
  }

  const roleFilter = filters.find(filter => filter.column.field === 'roles' && !!filter.value.length);
  const constraints = getFilterConstraints(filters.filter(filter => filter.column.field !== 'roles'));
  if (roleFilter) {
    return [
      {
        roles: {
          some: {
            role: {
              in: roleFilter.value,
            },
          },
        },
      },
      ...constraints,
    ];
  }

  return constraints;
};
