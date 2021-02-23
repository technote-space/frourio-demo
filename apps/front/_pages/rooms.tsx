import type { FC } from 'react';
import type { Room } from '$/packages/domain/database/room';
import { memo } from 'react';
import { Flex, Wrap, Box, Center, Image, Heading, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { client } from '^/utils/api';
import useFetch from '^/hooks/useFetch';
import { useDispatchContext } from '^/store';

const Rooms: FC = memo(() => {
  const { dispatch } = useDispatchContext();
  const rooms = useFetch(dispatch, [], client.rooms);

  const RoomItem: FC<{ room: Room }> = ({ room }) => <Box
    key={room.id}
    shadow="md"
    maxW="sm"
    borderWidth="1px"
    p="4"
    m="2"
  >
    <Flex direction="column">
      <Heading as="h4" size="md" mb={2}>
        {room.name}
      </Heading>
      <Box>
        <Image src={`${process.env.BASE_PATH}/cover2.jpg`}/>
      </Box>
    </Flex>
    <Center mt={3}>
      <Button as={Link} to={`${process.env.BASE_PATH}/room/${room.id}`}>お部屋の詳細</Button>
    </Center>
  </Box>;

  return rooms.data ? <Wrap m={4}>
    {rooms.data.map(room => <RoomItem key={room.id} room={room}/>)}
  </Wrap> : null;
});

Rooms.displayName = 'Rooms';
export default Rooms;
