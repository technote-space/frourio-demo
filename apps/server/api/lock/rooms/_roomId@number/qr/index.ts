import type { RoomQrBody } from '$/validators';
import type { ValidateRoomQrResult } from '@frourio-demo/types';

export type Methods = {
  post: {
    reqBody: RoomQrBody;
    resBody: ValidateRoomQrResult;
  };
}
