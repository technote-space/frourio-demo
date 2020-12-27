import type { AuthHeader } from '$/types';
import type { Room, CreateRoomData } from '$/repositories/room';
import type { Query, QueryResult } from 'material-table';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<Room>;
    resBody: QueryResult<Room>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: CreateRoomData;
    resBody: Room;
  }
}
