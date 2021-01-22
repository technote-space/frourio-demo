import type { Role } from '$/repositories/role';
import type { ProcessRoleType } from '$/repositories/admin';
import type { SavedFileType } from '$/service/multipart';
import { saveFile } from '$/service/multipart';
import { processRoleConnections } from '$/repositories/admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CheckPassword<T extends Record<string, any>> =
  T extends { id: number } ? (T & { password?: string }) : (T & { password: string });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processBody = async <T extends Record<string, any> & { roles?: Role[] }>(body: T) => 
  saveFile(processRoleConnections(body)) as Promise<CheckPassword<SavedFileType<ProcessRoleType<T>>>>;
