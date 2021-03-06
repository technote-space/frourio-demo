import type { FC } from 'react';
import type { Room } from '$/packages/domain/database/room';
import { memo, useState, useCallback } from 'react';
import { Box, Wrap, Grid, GridItem, Center, Button, Image, Heading, Link } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { client } from '^/utils/api';
import useFetch from '^/hooks/useFetch';
import { useDispatchContext } from '^/store';

type Props = {
  room?: Room;
  onChangeRoomId: (id: number) => void;
}

const SelectRoom: FC<Props> = memo(({ room, onChangeRoomId }: Props) => {
  const { dispatch } = useDispatchContext();
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  const rooms = useFetch(dispatch, [], client.reservation.rooms, { enabled: open });

  const RoomItem: FC<{ room: Room }> = ({ room }) => {
    const handleClick = () => {
      onChangeRoomId(room.id);
      handleClose();
    };

    return <Box shadow="md" p={2} m={2} maxW={400}>
      <Heading as="h5" size="sm">{room.name}</Heading>
      <Box>
        <Image src={`${process.env.BASE_PATH}/cover2.jpg`}/>
      </Box>
      <Grid templateColumns="repeat(1, 1fr)" gap={4} m={4}>
        <Grid templateColumns="repeat(2, 1fr)" gap={5}>
          <GridItem>ご利用可能最大人数</GridItem>
          <GridItem>{room.number}名様</GridItem>
        </Grid>
        <Grid templateColumns="repeat(2, 1fr)" gap={5}>
          <GridItem>料金(1泊1人あたり)</GridItem>
          <GridItem>¥{room.price.toLocaleString()}</GridItem>
        </Grid>
      </Grid>
      <Center>
        <Button onClick={handleClick}>選択</Button>
      </Center>
    </Box>;
  };

  return <Box>
    <Box m={1} p={2} height="100%">
      <Heading as="h4" size="md">お部屋</Heading>
      <Link onClick={handleOpen}>
        {room ? room.name : '選択してください'}
      </Link>
    </Box>
    <Modal isOpen={open} onClose={handleClose} size="4xl">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>お部屋を選択</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <Wrap>
            {rooms.data?.map(room => <RoomItem key={room.id} room={room}/>)}
          </Wrap>
        </ModalBody>
      </ModalContent>
    </Modal>
  </Box>;
});

SelectRoom.displayName = 'SelectRoom';
export default SelectRoom;
