import type { FC } from 'react';
import type { Model } from '~/components/DataTable';
import { useMemo } from 'react';
import useFetch from '~/hooks/useFetch';
import { client } from '~/utils/api';
import { getPriceCalc } from '~/utils/calc';
import { useDispatchContext } from '~/store';

type Props = {
  authHeader: { authorization: string };
  rowData: Partial<Model>;
}

const DisplayAmount: FC<Props> = ({ authHeader, rowData }: Props) => {
  const { dispatch } = useDispatchContext();
  const room         = useFetch(dispatch, undefined, client.reservations.room, {
    headers: authHeader,
    query: { roomId: Number(rowData['roomId']) },
    enabled: !!rowData['roomId'],
  });

  return useMemo(() => room?.data && rowData['checkin'] && rowData['checkout'] && rowData['number'] ? <>
    <div style={{
      whiteSpace: 'nowrap',
    }}>{getPriceCalc(room.data.price, rowData['number'], rowData['checkin'], rowData['checkout'], 0)}</div>
  </> : null, [room?.data, rowData['checkin'], rowData['checkout'], rowData['number']]);
};

export default DisplayAmount;
