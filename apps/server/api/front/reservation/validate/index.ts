import type { AuthHeader } from '@frourio-demo/types';
import type { ValidateReservationBody } from '$/validators';

export type Methods = {
  post: {
    reqHeaders?: AuthHeader;
    reqBody: ValidateReservationBody;
  }
}
