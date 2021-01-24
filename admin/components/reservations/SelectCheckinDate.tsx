import type { FC } from 'react';
import type { CheckinNotSelectableEvent } from '$/domains/admin/reservations';
import type { Model, EditComponentPropsWithError } from '~/components/DataTable';
import { useMemo, useCallback } from 'react';
import { format, startOfToday } from 'date-fns';
import { client, handleAuthError } from '~/utils/api';
import Calendar from '~/components/reservations/Calendar';

type Props = {
  authHeader: { authorization: string };
  props: EditComponentPropsWithError<Model>;
}

const SelectCheckinDate: FC<Props> = ({ authHeader, props }: Props) => {
  const fetchCallback = useCallback((dispatch, rowData, info) => handleAuthError(dispatch, [] as Array<CheckinNotSelectableEvent>, client.reservations.calendar.checkin.get, {
    headers: authHeader,
    query: {
      roomId: rowData['roomId'],
      start: info.start,
      end: info.end,
      id: rowData['id'],
    },
  }), []);
  const isValidDate = useCallback((date, rowData, eventDates) => {
    return !eventDates.includes(format(date, 'yyyy-MM-dd'));
  }, []);
  const getInitialDate = useCallback((rowData, value) => value ? value : startOfToday(), []);

  return useMemo(() => <Calendar
    props={props}
    requiredFields={['roomId']}
    fetchCallback={fetchCallback}
    isValidDate={isValidDate}
    getInitialDate={getInitialDate}
    resultHour={15}
    target="checkin"
  />, [props]);
};

export default SelectCheckinDate;
