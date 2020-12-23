import type { Room, UpdateRoomData } from '$/repositories/room';

export type Methods = {
  get: {
    resBody: Room;
  };
  patch: {
    reqBody: UpdateRoomData;
    resBody: Room;
  };
  delete: {
    resBody: Room;
  }
}
