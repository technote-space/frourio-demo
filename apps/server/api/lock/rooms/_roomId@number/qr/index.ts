import type { RoomQrBody } from '$/validators';
import type { ValidateRoomQrResult } from '$/packages/application/usecase/lock/rooms/validateQr';

export type Methods = {
  post: {
    reqBody: RoomQrBody;
    resBody: ValidateRoomQrResult;
  };
}
