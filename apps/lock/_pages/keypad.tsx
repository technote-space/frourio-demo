import type { FC } from 'react';
import { memo, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { Flex, Box, HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { useDispatchContext } from '#/store';
import useFetch from '#/hooks/useFetch';
import { client } from '#/utils/api';
import { setNotice, setError } from '#/utils/actions';
import { ROOM_KEY_DIGITS } from '@frourio-demo/constants';

const Keypad: FC = memo(() => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { dispatch } = useDispatchContext();
  const [isSending, setIsSending] = useState(false);
  const room = useFetch(dispatch, undefined, client.rooms._roomId(Number(id)));
  const handleChange = useCallback((value: string) => {
    setIsSending(true);
    console.log(value);
    client.rooms._roomId(Number(id)).keypad.post({ body: { roomId: Number(id), key: value } }).then((data) => {
      console.log(data.body);
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

  useEffect(() => {
    if (room.error) {
      history.push(`${process.env.BASE_PATH}/rooms`);
    }
  }, [room.error]);

  return room.error ? null : <Flex justifyContent="center" alignItems="center" width="100%">
    <Box p={10} shadow="md" borderWidth={1} background="teal">
      <HStack>
        <PinInput size="lg" onComplete={handleChange} isDisabled={isSending}>
          {[...Array(ROOM_KEY_DIGITS)].map((_, index) => <PinInputField key={index} borderColor="#ccc" />)}
        </PinInput>
      </HStack>
    </Box>
  </Flex>;
});

Keypad.displayName = 'Meal';
export default Keypad;
