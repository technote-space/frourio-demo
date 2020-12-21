import type { FC } from 'react';
import { useState, useCallback, useMemo } from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';

type Props = {
  id?: string;
  placeholder?: string;
  value?: string;
}

const PasswordInput: FC<Props> = (props: Props) => {
  const [show, setShow] = useState(false);
  const handleClick     = useCallback(() => setShow(!show), [show]);

  return useMemo(() =>
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>, [show, props.value]);
};

export default PasswordInput;
