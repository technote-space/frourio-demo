/* eslint-disable @typescript-eslint/no-explicit-any */
import type Blob from 'cross-blob';
import type { Admin } from '$/repositories/admin';
import type { Role } from '$/repositories/role';
import type { SavedFileType } from '$/service/multipart';
import type { Filter } from '@technote-space/material-table';
import { saveFile } from '$/service/multipart';
import { getFilterConstraints, isMultipartFile } from '$/repositories/utils';

type CheckPassword<T extends Record<string, any>> =
  T extends { id: number } ? (T & { password?: string }) : (T & { password: string });

export type ProcessRoleType<T extends Record<string, any> & { roles?: Role[] }> = {
  [key in keyof T]: key extends 'roles' ? { connect: { role: string }[] } : T[key]
};

export const processRoleConnections = <T extends Record<string, any> & { roles?: Role[] }>(data: T): ProcessRoleType<T> => {
  return {
    ...data,
    roles: {
      connect: (data.roles ?? []).map(role => ({ role: role.role })),
    },
  };
};

type ProcessIconType<T extends Record<string, any> & { icon?: Blob | string }> = {
  [key in keyof T]: key extends 'icon' ? (T[key] extends string ? never : Blob) : T[key]
};
export const checkIcon = <T extends Record<string, any> & { icon?: Blob | string }>(data: T): ProcessIconType<T> => {
  if (!isMultipartFile(data.icon)) {
    delete data.icon;
  }

  return data;
};

export const processBody = async <T extends Record<string, any> & { roles?: Role[]; icon?: Blob | string }>(body: T) =>
  saveFile(processRoleConnections(checkIcon(body))) as Promise<CheckPassword<SavedFileType<ProcessRoleType<ProcessIconType<T>>>>>;

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
