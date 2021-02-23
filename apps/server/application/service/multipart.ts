/* eslint-disable @typescript-eslint/no-explicit-any */
import type Blob from 'cross-blob';
import { promises } from 'fs';
import { resolve, join, extname } from 'path';
import { Multipart } from 'fastify-multipart';
import { startOfToday, format } from 'date-fns';

export const isMultipartFile = (value: any): value is Multipart => {
  return !!value && typeof value === 'object' && 'filename' in value && 'toBuffer' in value;
};

export type SavedFileType<T extends Record<string, any>> = {
  [key in keyof T]: T[key] extends Multipart | Blob | undefined ? string : T[key]
}
export const saveFile = async <T extends Record<string, any>>(body: T): Promise<SavedFileType<T>> => {
  return Object.fromEntries(await Object.entries(body).reduce(async(prev, [key, value]) => {
    const acc = await prev;
    if (isMultipartFile(value)) {
      const dir = join(format(startOfToday(), 'yyyy'), format(startOfToday(), 'MM'));
      const saveDir = resolve(process.cwd(), 'public', 'icons', dir);
      const filename = `${format(startOfToday(), 'yyyy')}${Math.random().toString(36).slice(-8)}${extname(value.filename)}`;
      await promises.mkdir(saveDir, { recursive: true });
      await promises.writeFile(join(saveDir, filename), await value.toBuffer());
      return acc.concat([[key, join(dir, filename)]]);
    }

    return acc.concat([[key, value]]);
  }, Promise.resolve([] as [string, any][]))) as Promise<SavedFileType<T>>;
};

export const processMultipartFormDataBody = (body: Record<string, any>) => {
  Object.keys(body).forEach(key => {
    if (typeof body[key] === 'string' && /^{[\s\S]*}$/.test(body[key])) {
      try {
        body[key] = JSON.parse(body[key]);
      } catch {
        //
      }
    } else if (body[key] && typeof body[key] === 'object' && !isMultipartFile(body[key])) {
      body[key] = processMultipartFormDataBody(body[key]);
    }
  });

  return body;
};
