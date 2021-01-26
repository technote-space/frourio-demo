import type { FC, ReactElement } from 'react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useStoreContext, useDispatchContext } from '~/store';
import { changeTitle } from '~/utils/actions';
import useAuthToken from '~/hooks/useAuthToken';
import pages from '~/_pages';

const Route: FC = () => {
  const [auth] = useAuthToken();
  const { page, roles } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const [nextPage, setNextPage] = useState<ReactElement | null>(null);
  const pageInstances = useRef<Record<string, ReactElement>>({});

  useEffect(() => {
    if (auth && (!roles || !roles.includes(page))) {
      return;
    }

    window.scrollTo(0, 0);
    if (!(page in pageInstances.current)) {
      const Component: FC<{ page: string }> = pages[page].page;
      pageInstances.current[page] = <Component page={page}/>;
    }

    setNextPage(pageInstances.current[page]);
    changeTitle(dispatch, pages[page].label);
  }, [page, roles, auth]);

  return useMemo(() => nextPage, [nextPage]);
};

export default Route;
