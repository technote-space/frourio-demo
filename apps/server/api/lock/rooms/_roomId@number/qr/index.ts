import type { RoomQrBody } from '$/domains/lock/rooms/validators';
import type { ValidateRoomQrResult } from '@frourio-demo/types';

export type Methods = {
  post: {
    reqBody: RoomQrBody;
    resBody: ValidateRoomQrResult;
  };
}
