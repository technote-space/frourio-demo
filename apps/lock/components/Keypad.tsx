import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { Box, HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { useDispatchContext } from '#/store';
import { client } from '#/utils/api';
import { setNotice, setError } from '#/utils/actions';
import { ROOM_KEY_DIGITS } from '@frourio-demo/constants';

type Props = {
  roomId: number;
  isSending: boolean;
  setIsSending: (flag: boolean) => void;
}

const Keypad: FC<Props> = memo(({ roomId, isSending, setIsSending }: Props) => {
  const { dispatch } = useDispatchContext();
  const handleChange = useCallback((value: string) => {
    setIsSending(true);
    client.rooms._roomId(roomId).keypad.post({ body: { roomId, key: value } }).then(data => {
      if (data.body.result) {
        setNotice(dispatch, 'Unlocked!!');
      } else {
        setError(dispatch, data.body.message);
      }
    }).catch(error => {
      setError(dispatch, error.message);
    }).finally(() => {
      setIsSending(false);
    });
  }, []);

  return <Box p={5} m={5} shadow="md" borderWidth={1} background="teal" color="white">
    <HStack>
      <PinInput size="lg" onComplete={handleChange} isDisabled={isSending}>
        {[...Array(ROOM_KEY_DIGITS)].map((_, index) => <PinInputField key={index} borderColor="#ccc" />)}
      </PinInput>
    </HStack>
  </Box>;
});

Keypad.displayName = 'Keypad';
export default Keypad;
