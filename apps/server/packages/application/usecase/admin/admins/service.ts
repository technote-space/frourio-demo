/* eslint-disable @typescript-eslint/no-explicit-any */
import type Blob from 'cross-blob';
import type { Role } from '$/packages/domain/database/role';
import type { SavedFileType } from '$/packages/application/service/multipart';
import type { Multipart } from 'fastify-multipart';
import { saveFile } from '$/packages/application/service/multipart';
import { isMultipartFile } from '$/packages/application/service/multipart';

type CheckPassword<T extends Record<string, any>> =
  T extends { id: number } ? (T & { password?: string }) : (T & { password: string });

export type ProcessRoleType<T extends Record<string, any> & { roles?: Role[] }> = {
  [key in keyof T]: key extends 'roles' ? { connect: { role: string }[] } : T[key]
};

export const processRoleConnections = <T extends Record<string, any> & { roles?: Role[] }>(data: T, isCreate: boolean): ProcessRoleType<T> => {
  const reference = isCreate ? 'connect' : 'set';
  return {
    ...data,
    roles: {
      [reference]: (data.roles ?? []).map(role => ({ role: role.role })),
    },
  };
};

type ProcessIconType<T extends Record<string, any> & { icon?: Blob | string | Multipart }> = {
  [key in keyof T]: key extends 'icon' ? (T[key] extends string ? never : Blob) : T[key]
};
export const checkIcon = <T extends Record<string, any> & { icon?: Blob | string | Multipart }>(data: T): ProcessIconType<T> => {
  if (!isMultipartFile(data.icon)) {
    delete data.icon;
  }

  return data;
};

export const processBody = <T extends Record<string, any> & { roles?: Role[]; icon?: Blob | string }>(body: T, isCreate: boolean) =>
  saveFile(processRoleConnections(checkIcon(body), isCreate)) as Promise<CheckPassword<SavedFileType<ProcessRoleType<ProcessIconType<T>>>>>;
