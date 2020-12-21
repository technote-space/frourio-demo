import type { AuthHeader } from '$/types';
import type { Room, CreateRoomData, RoomOrderByInput } from '$/repositories/room';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: {
      page?: number;
      orderBy?: RoomOrderByInput;
    };
    resBody: Room[];
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateRoomData;
    resBody: Room;
  }
}
