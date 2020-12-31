import { defineController } from './$relay';
import { getCheckin, checkin } from '$/domains/dashboard';
import { parseQuery } from '$/repositories/utils';

export default defineController(({ getCheckin, checkin }), ({ getCheckin }) => ({
  get: async({ query }) => {
    if (!query) {
      return getCheckin();
    }

    return getCheckin(parseQuery(query.query), query.date);
  },
  patch: async({ body }) => checkin(body.id),
}));
