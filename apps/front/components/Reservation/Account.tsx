import type { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { memo, useCallback, useState, useEffect } from 'react';
import { Box, Heading, Center, Button } from '@chakra-ui/react';
import { useStoreContext } from '^/store';

type Props = {
  hidden: boolean;
  onDetail: () => void;
}

const Account: FC<Props> = memo(({ hidden, onDetail }: Props) => {
  const { guest } = useStoreContext();
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const handleClickLogin = useCallback(() => {
    setIsRedirecting(true);
    loginWithRedirect({
      appState: { page: window.location.pathname },
    }).then();
  }, []);
  const handleClickGuestReservation = useCallback(() => {
    onDetail();
  }, []);

  useEffect(() => {
    if (guest) {
      onDetail();
    }
  }, [guest]);

  return isAuthenticated || isLoading ? null : <Box
    shadow="md"
    p={[1, 2, 4]}
    m="2"
    borderWidth={1}
    display={hidden ? 'none' : ['flex', 'flex', 'inline-block']}
    flexDirection='column'
    minW={['none', 'none', 400]}
  >
    <Heading as="h4" size="lg">ご予約</Heading>
    <Box m={1} p={2} height="100%">
      <Center>
        <Button m={1} onClick={handleClickGuestReservation} disabled={isRedirecting}>
          ゲスト予約
        </Button>
        <Button m={1} onClick={handleClickLogin} disabled={isRedirecting}>
          ログイン
        </Button>
      </Center>
    </Box>
  </Box>;
});

Account.displayName = 'Account';
export default Account;
