import { defineController } from './$relay';
import { getCheckin, checkin } from '$/domains/admin/dashboard';

export default defineController(({ getCheckin, checkin }), ({ getCheckin, checkin }) => ({
  get: async({ query }) => getCheckin(query.query, query.date),
  patch: async({ body }) => checkin(body.id),
}));
