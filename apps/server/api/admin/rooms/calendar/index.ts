import type { AuthHeader } from '@frourio-demo/types';
import type { RoomStatusEvent } from '$/domains/admin/rooms';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    query: {
      roomId: number;
      start: Date;
      end: Date;
    };
    resBody: RoomStatusEvent[];
  }
}
