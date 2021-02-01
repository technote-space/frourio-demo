/* eslint-disable @typescript-eslint/no-explicit-any */
import Faker from 'faker';
import { DelegateTypes } from './factory';

type Callback<T> = (faker: Faker.FakerStatic, ...params: any[]) => Partial<T>;
export const define = <T>(type: DelegateTypes, callback: Callback<T>) => {
  defines[type] = callback;
};

const defines: Record<string, Callback<any>> = {};
export const getDefines = () => defines;
