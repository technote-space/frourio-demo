import type { FC } from 'react';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import type { AuthHeader } from '@frourio-demo/types';
import { memo, useCallback } from 'react';
import { format, startOfToday } from 'date-fns';
import { client, handleAuthError } from '~/utils/api';
import Calendar from '~/components/reservations/Calendar';

type Props = {
  authHeader: AuthHeader;
  props: EditComponentPropsWithError<Model>;
}

const SelectCheckoutDate: FC<Props> = memo(({ authHeader, props }: Props) => {
  const fetchCallback = useCallback((dispatch, rowData, info) => handleAuthError(dispatch, [], client.reservations.calendar.checkout.get, {
    headers: authHeader,
    query: {
      roomId: rowData['roomId'],
      end: info.end,
      checkin: rowData['checkin'],
      id: rowData['id'],
    },
  }), []);
  const isValidDate = useCallback((date, rowData, eventDates) => {
    return eventDates.includes(format(date, 'yyyy-MM-dd'));
  }, []);
  const getInitialDate = useCallback(rowData => rowData['checkin'] ? rowData['checkin'] : startOfToday(), []);

  return <Calendar
    props={props}
    requiredFields={['roomId', 'checkin']}
    fetchCallback={fetchCallback}
    isValidDate={isValidDate}
    getInitialDate={getInitialDate}
    resultHour={10}
    target="checkout"
  />;
});

SelectCheckoutDate.displayName = 'SelectCheckoutDate';
export default SelectCheckoutDate;
