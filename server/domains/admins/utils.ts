import { saveFile } from '$/service/multipart';
import { processRoleConnections } from '$/repositories/admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const processBody = async <T extends Record<string, any> & { roles?: string[] }>(body: T) => await saveFile(processRoleConnections(body));
