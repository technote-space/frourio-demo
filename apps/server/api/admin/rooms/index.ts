import type { AuthHeader } from '@frourio-demo/types';
import type { Room } from '$/repositories/room';
import type { Query, QueryResult } from '@technote-space/material-table';
import type { RoomBody } from '$/validators';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: Query<Room>;
    resBody: QueryResult<Room>;
  };
  post: {
    reqHeaders: AuthHeader;
    reqBody: RoomBody;
    resBody: Room;
  }
}
