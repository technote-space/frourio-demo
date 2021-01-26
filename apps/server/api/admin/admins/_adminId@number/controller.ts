import { defineController } from './$relay';
import { get, update, remove } from '$/domains/admin/admins';
import { processBody } from '$/domains/admin/admins/utils';

export default defineController(({ get, update, remove }), ({ get, update, remove }) => ({
  get: async({ params }) => get(params.adminId),
  patch: async({ params, body }) => update(params.adminId, await processBody(body)),
  delete: async({ params }) => remove(params.adminId),
}));
