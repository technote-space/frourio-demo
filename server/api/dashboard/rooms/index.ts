import type { AuthHeader } from '$/types';
import type { SelectableRoom } from '$/domains/dashboard';

export type Methods = {
  get: {
    reqHeaders: AuthHeader;
    resBody: SelectableRoom[];
  }
}
