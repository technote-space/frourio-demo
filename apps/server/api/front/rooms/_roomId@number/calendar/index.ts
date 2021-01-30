import type { NotSelectableEvent } from '$/domains/front/rooms';

export type Methods = {
  get: {
    query: {
      start: Date;
      end: Date;
    };
    resBody: NotSelectableEvent[];
  }
}
