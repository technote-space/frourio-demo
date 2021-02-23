import type { NotSelectableEvent } from '$/packages/application/usecase/front/rooms/calendar';

export type Methods = {
  get: {
    query: {
      start: Date;
      end: Date;
    };
    resBody: NotSelectableEvent[];
  }
}
