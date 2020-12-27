import type { AuthHeader } from '$/types';
import type { Room } from '$/repositories/room';
import type { Query, QueryResult } from 'material-table';
import type { RoomBody } from '$/domains/rooms/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query?: Query<Room>;
    resBody: QueryResult<Room>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: RoomBody;
    resBody: Room;
  }
}
