import type { FC } from 'react';
import { memo, useEffect } from 'react';
import NextHead from 'next/head';
import { useLocation, matchPath } from 'react-router-dom';
import { useStoreContext, useDispatchContext } from '^/store';
import { changeTitle } from '^/utils/actions';
import pages from '^/_pages';

const Head: FC = memo(() => {
  const { dispatch } = useDispatchContext();
  const { title } = useStoreContext();
  const location = useLocation();

  useEffect(() => {
    const page = Object.entries(pages).find(([key, value]) => !!matchPath(location.pathname, {
      path: value.path ?? `/${key}`,
      exact: value.exact,
    }));
    changeTitle(dispatch, page ? page[1].label : undefined);
  }, [location?.pathname]);

  return <NextHead>
    <meta name="viewport" content="initial-scale=1, width=device-width"/>
    <title>{title ? `${title} - ` : ''}Reservation System</title>
    <link rel="shortcut icon" href="/favicon.png"/>
    {/*<meta name="description" content={description} />*/}
    {/*/!* Twitter *!/*/}
    {/*<meta name="twitter:card" content={largeCard ? 'summary_large_image' : 'summary'} />*/}
    {/*<meta name="twitter:site" content="@MaterialUI" />*/}
    {/*<meta name="twitter:title" content={title} />*/}
    {/*<meta name="twitter:description" content={description} />*/}
    {/*<meta name="twitter:image" content={card} />*/}
    {/*/!* Facebook *!/*/}
    {/*<meta property="og:type" content="website" />*/}
    {/*<meta property="og:title" content={title} />*/}
    {/*<meta property="og:url" content={`https://material-ui.com`} />*/}
    {/*<meta property="og:description" content={description} />*/}
    {/*<meta property="og:image" content={card} />*/}
    {/*<meta property="og:ttl" content="604800" />*/}
  </NextHead>;
});

Head.displayName = 'Head';
export default Head;
