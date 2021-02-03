import type { FC } from 'react';
import type { AuthHeader } from '@frourio-demo/types';
import { memo } from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import useFetch from '^/hooks/useFetch';
import { useDispatchContext } from '^/store';
import { client } from '^/utils/api';
import { ACCOUNT_FIELDS } from '^/utils/constants';

type Props = {
  authHeader: AuthHeader;
}

const Detail: FC<Props> = memo(({ authHeader }: Props) => {
  const { dispatch } = useDispatchContext();
  const guestInfo = useFetch(dispatch, {}, client.account.guest, {
    headers: authHeader,
  });
  const InfoItem: FC<{ name: string; label: string }> = ({ name, label }) => <>
    <GridItem>{label}</GridItem>
    <GridItem mb={[3, 0]}>{guestInfo.data![name]}</GridItem>
  </>;

  return guestInfo.data ? <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={4}>
    <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={[1, 5]}>
      {ACCOUNT_FIELDS.slice(0, ACCOUNT_FIELDS.length / 2).map(field =>
        <InfoItem key={`group-${field.name}`} name={field.name} label={field.label}/>)}
    </Grid>
    <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={[1, 5]}>
      {ACCOUNT_FIELDS.slice(ACCOUNT_FIELDS.length / 2).map(field =>
        <InfoItem key={`group-${field.name}`} name={field.name} label={field.label}/>)}
    </Grid>
  </Grid> : null;
});

Detail.displayName = 'Detail';
export default Detail;
