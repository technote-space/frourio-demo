import type { FC } from 'react';
import { Icon } from '@chakra-ui/react';
import { IoMdConstruct } from 'react-icons/io';

const Facility: FC = () => {
  return <div>
    <Icon as={IoMdConstruct}/> 工事中...
  </div>;
};

export default Facility;
