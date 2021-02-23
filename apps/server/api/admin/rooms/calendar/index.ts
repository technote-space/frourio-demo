import type { AuthHeader } from '@frourio-demo/types';
import type { RoomStatusEvent } from '$/packages/application/usecase/admin/rooms/getStatusCalendarEvents';

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
