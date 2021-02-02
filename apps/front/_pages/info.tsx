import type { FC } from 'react';
import { memo } from 'react';
import { Icon } from '@chakra-ui/react';
import { IoMdConstruct } from 'react-icons/io';

const Info: FC = memo(() => {
  return <div>
    <Icon as={IoMdConstruct}/> 工事中...
  </div>;
});

Info.displayName = 'Info';
export default Info;
