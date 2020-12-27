import type { AuthHeader } from '$/types';
import type { Room } from '$/repositories/room';
import type { RoomBody } from '$/domains/rooms/validators';

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
