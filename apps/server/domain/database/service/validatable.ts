import { Models, Delegate } from './types';

export interface IValidatable {
  getModelName(): Models;

  getDelegate(): Delegate;
}
