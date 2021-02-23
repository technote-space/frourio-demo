import type { AuthHeader } from '@frourio-demo/types';
import type { Room } from '$/packages/domain/database/room';
import type { RoomBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Room;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: RoomBody;
    resBody: Room;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Room;
  }
}
