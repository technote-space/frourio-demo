import type { Role } from '$/repositories/role';
import type { SavedFileType } from '$/service/multipart';
import { saveFile } from '$/service/multipart';

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
