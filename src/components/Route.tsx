import type { FC, ReactElement } from 'react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useStoreContext, useDispatchContext } from '~/store';
import pages from '~/_pages';

const Route: FC = () => {
  const [, , removeCookie]      = useCookies(['authToken']);
  const { page }                = useStoreContext();
  const { dispatch }            = useDispatchContext();
  const [nextPage, setNextPage] = useState<ReactElement | null>(null);
  const pageInstances           = useRef<{ [key: string]: ReactElement }>({});

  useEffect(() => {
    if (page === 'logout') {
      removeCookie('authToken');
      dispatch({ type: 'LOGOUT' });
      return;
    }

    window.scrollTo(0, 0);
    if (!(page in pageInstances.current)) {
      const Component: FC         = pages[page].page;
      pageInstances.current[page] = <Component/>;
    }

    setNextPage(pageInstances.current[page]);
  }, [page]);

  return useMemo(() => nextPage, [nextPage]);
};

export default Route;
