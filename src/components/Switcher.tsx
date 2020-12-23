import type { FC, ReactElement } from 'react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useStoreContext } from '~/store';
import pages from '~/_pages';

const Switcher: FC = () => {
  const [, setCookie]           = useCookies(['authToken']);
  const { page }                = useStoreContext();
  const [nextPage, setNextPage] = useState<ReactElement | null>(null);
  const pageInstances           = useRef<{ [key: string]: ReactElement }>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (page && page in pages) {
      if (!(page in pageInstances.current)) {
        const Component: FC         = pages[page].page;
        pageInstances.current[page] = <Component/>;
      }

      setNextPage(pageInstances.current[page]);
      return;
    }

    // logout
    setCookie('authToken', undefined);
  }, [page]);

  return useMemo(() => nextPage, [nextPage]);
};

export default Switcher;
