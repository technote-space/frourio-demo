import type { RoomKeyBody } from '$/validators';
import type { ValidateRoomKeyResult } from '$/packages/application/usecase/lock/rooms/validateKey';

export type Methods = {
  post: {
    reqBody: RoomKeyBody;
    resBody: ValidateRoomKeyResult;
  };
}
