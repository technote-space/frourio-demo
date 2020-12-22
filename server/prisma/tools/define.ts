import Faker from 'faker';
import { DelegateTypes } from './factory';

type Callback<T> = (faker: Faker.FakerStatic) => Partial<T>;
export const define = <T>(type: DelegateTypes, callback: Callback<T>) => {
  defines[type] = callback;
};

const defines: { [key: string]: Callback<any> } = {};
export const getDefines                         = () => defines;
