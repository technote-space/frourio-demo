/* eslint-disable @typescript-eslint/no-explicit-any */
import type Blob from 'cross-blob';
import { promises } from 'fs';
import { resolve, join, extname } from 'path';
import { Multipart } from 'fastify-multipart';
import { isMultipartFile } from '$/repositories/utils';
import { startOfToday, format } from 'date-fns';

export type SavedFileType<T extends Record<string, any>> = {
  [key in keyof T]: T[key] extends Multipart | Blob | undefined ? string : T[key]
}
export const saveFile = async <T extends Record<string, any>>(body: T): Promise<SavedFileType<T>> => {
  return Object.fromEntries(await Object.entries(body).reduce(async(prev, [key, value]) => {
    const acc = await prev;
    if (isMultipartFile(value)) {
      const filedir = join(format(startOfToday(), 'yyyy'), format(startOfToday(), 'MM'));
      const dirname = resolve(process.cwd(), 'public', 'icons', filedir);
      const filename = `${format(startOfToday(), 'yyyy')}${Math.random().toString(36).slice(-8)}${extname(value.filename)}`;
      await promises.mkdir(dirname, { recursive: true });
      await promises.writeFile(join(dirname, filename), await value.toBuffer());
      return acc.concat([[key, join(filedir, filename)]]);
    }

    return acc.concat([[key, value]]);
  }, Promise.resolve([] as [string, any][]))) as Promise<SavedFileType<T>>;
};
