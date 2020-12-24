import type { AuthHeader } from '$/types';
import type { Room, UpdateRoomData } from '$/repositories/room';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: Room;
  };
  patch: {
    reqHeaders: AuthHeader;
    reqBody: UpdateRoomData;
    resBody: Room;
  };
  delete: {
    reqHeaders: AuthHeader;
    resBody: Room;
  }
}
