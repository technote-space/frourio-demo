/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DelegateTypes } from '$/packages/infra/database/prisma/tools/factory';
import Faker from 'faker';
import '$/packages/infra/database/prisma/factories';
import { getDefines } from '$/packages/infra/database/prisma/tools/define';

export const getDummyData = <T>(type: DelegateTypes, override?: Partial<T>, ...params: any[]) => ({
  ...getDefines()[type](Faker, params),
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
