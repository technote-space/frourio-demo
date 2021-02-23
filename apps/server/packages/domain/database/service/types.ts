/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
import type { Prisma, PrismaClient } from '$/prisma/client';

export type Models = {
  [key in keyof PrismaClient]: PrismaClient[key] extends {
    findUnique,
    findMany,
    findFirst,
    create,
    update,
    updateMany,
    upsert,
    delete,
    deleteMany,
    count,
  } ? key : never
}[keyof PrismaClient]
export interface Delegate {
  findFirst(args?: { where: Record<string, any> }): Promise<object | null>;
}

export type ModelWhere<T extends object> = {
  [key in keyof T]?: T[key] extends undefined ? never :
    T[key] extends number ? (Prisma.IntFilter | number) :
      T[key] extends string ? (Prisma.StringFilter | string) :
        T[key] extends Date ? (Prisma.DateTimeFilter | Date | string) :
          never
};
export type ModelWhereSub<T extends object> = ModelWhere<T> | {
  AND?: Prisma.Enumerable<ModelWhereSub<T> & ModelWhere<T>>;
  OR?: Prisma.Enumerable<ModelWhereSub<T> & ModelWhere<T>>;
  NOT?: Prisma.Enumerable<ModelWhereSub<T> & ModelWhere<T>>;
};

export type RelationFilterWhereInput = {
  AND?: Prisma.Enumerable<RelationFilterWhereInput & {
    [key: string]: any;
  }>;
  OR?: Prisma.Enumerable<RelationFilterWhereInput & {
    [key: string]: any;
  }>;
  NOT?: Prisma.Enumerable<RelationFilterWhereInput & {
    [key: string]: any;
  }>;
} & {
  [key: string]: any;
};
export type RelationFilterWhere = {
  every?: RelationFilterWhereInput;
  some?: RelationFilterWhereInput;
  none?: RelationFilterWhereInput;
};
export type RelationFilterWhereSub<T extends object> = {
  [key in keyof T]?: T[key] extends undefined ? never :
    T[key] extends {}[] ? RelationFilterWhere :
      never;
};

export type Where<T extends object> = {
  AND: Array<ModelWhereSub<T> | RelationFilterWhereSub<T>>;
};
export type OrderBy<T extends object> = {
  [key in keyof T]?: Prisma.SortOrder
};
export type TypeKey<T, type> = {
  [key in keyof T]: NonNullable<T[key]> extends type ? key : never
}[keyof T];
export type DateConstraint<T extends object> = {
  date?: Date;
  key: keyof T;
}
export type AdditionalWhere<T extends object> = ModelWhere<T> | RelationFilterWhereSub<T>;
