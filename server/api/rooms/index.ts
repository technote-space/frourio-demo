import type { Room, CreateRoomData, RoomOrderByInput } from '$/repositories/room';

export type Methods = {
  get: {
    query?: {
      page?: number;
      orderBy?: RoomOrderByInput;
    };
    resBody: Room[];
  };
  post: {
    reqBody: CreateRoomData;
    resBody: Room;
  }
}
