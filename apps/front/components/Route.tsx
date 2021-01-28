import type { FC, ReactElement } from 'react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useStoreContext, useDispatchContext } from '^/store';
import { changeTitle } from '^/utils/actions';
import pages from '^/_pages';

const Route: FC = () => {
  const { page } = useStoreContext();
  const { dispatch } = useDispatchContext();
  const [nextPage, setNextPage] = useState<ReactElement | null>(null);
  const pageInstances = useRef<Record<string, ReactElement>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!(page in pageInstances.current)) {
      const Component: FC<{ page: string }> = pages[page].page;
      pageInstances.current[page] = <Component page={page}/>;
    }

    setNextPage(pageInstances.current[page]);
    changeTitle(dispatch, pages[page].label);
  }, [page]);

  return useMemo(() => nextPage, [nextPage]);
};

export default Route;
