import type { RoomKeyBody } from '$/domains/lock/rooms/validators';
import type { ValidateRoomKeyResult } from '@frourio-demo/types';

export type Methods = {
  post: {
    reqBody: RoomKeyBody;
    resBody: ValidateRoomKeyResult;
  };
}
