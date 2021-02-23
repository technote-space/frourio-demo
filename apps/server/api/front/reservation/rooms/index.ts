import type { Room } from '$/packages/domain/database/room';

export type Methods = {
  get: {
    resBody: Room[];
  }
}
