import { defineController } from './$relay';
import { getCheckin, checkin, sendRoomKey } from '$/domains/admin/dashboard';

export default defineController(({ getCheckin, checkin, sendRoomKey }), ({ getCheckin, checkin, sendRoomKey }) => ({
  get: async({ query }) => getCheckin(query.query, query.date),
  patch: async({ body }) => checkin(body.id),
  post: async({ body }) => sendRoomKey(body.id),
}));
