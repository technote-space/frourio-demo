/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DelegateTypes } from '$/packages/infra/database/prisma/runner';
import Faker from 'faker';
import { runner } from '$/packages/infra/database/prisma/runner';

export const getDummyData = <T>(type: DelegateTypes, override?: Partial<T>, ...params: any[]) => ({
  ...runner.getDefine(type)(Faker, params),
  ...override,
});

export const dropObjectData = <T extends Record<string, any>>(data: T) => {
  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key] === 'object' && !(data[key] instanceof Date)) {
      delete data[key];
    }
  });
  return data;
};

export const filterCreateData = <T>(data: T): T & { createdAt: Date; updatedAt: Date; } => ({
  ...dropObjectData(data),
  createdAt: new Date(),
  updatedAt: new Date(),
});
