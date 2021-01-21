/* eslint-disable @typescript-eslint/no-explicit-any */
import { promises } from 'fs';
import { resolve, extname } from 'path';
import { Multipart } from 'fastify-multipart';

export type SavedFileType<T extends Record<string, any>> = {
  [key in keyof T]: T[key] extends Multipart | undefined ? string : T[key]
}
const isMultipartFile = (value: any): value is Multipart => {
  return typeof value === 'object' && 'filename' in value && 'toBuffer' in value;
};
export const saveFile = async <T extends Record<string, any>>(body: T): Promise<SavedFileType<T>> => {
  return Object.fromEntries(await Object.entries(body).reduce(async(prev, [key, value]) => {
    const acc = await prev;
    if (isMultipartFile(value)) {
      const filename = `${Date.now()}${Math.random().toString(36).slice(-8)}${extname(value.filename)}`;
      await promises.writeFile(resolve(process.cwd(), 'public/icons', filename), await value.toBuffer());
      return acc.concat([[key, filename]]);
    }

    return acc.concat([[key, value]]);
  }, Promise.resolve([] as [string, any][]))) as Promise<SavedFileType<T>>;
};
