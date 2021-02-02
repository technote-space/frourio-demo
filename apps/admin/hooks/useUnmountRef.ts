// https://qiita.com/macotok/items/87a260988376bcfa2ffd
import { useRef, useEffect } from 'react';

const useUnmountRef = () => {
  const unmountRef = useRef(false);

  useEffect(
    () => () => {
      unmountRef.current = true;
    },
    [],
  );

  return unmountRef;
};

export default useUnmountRef;
