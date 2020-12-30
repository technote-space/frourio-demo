import { defineController } from './$relay';
import { getCheckin, checkin } from '$/domains/dashboard';

export default defineController(({ getCheckin, checkin }), ({ getCheckin }) => ({
  get: async({ query }) => {
    if (!query) {
      return getCheckin();
    }

    return getCheckin(
      typeof query.query === 'string' ? JSON.parse(query.query) : query.query,
      typeof query.date === 'string' ? new Date(query.date) : query.date,
    );
  },
  patch: async({ body }) => checkin(body.id),
}));
