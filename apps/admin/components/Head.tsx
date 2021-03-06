import type { FC } from 'react';
import { memo } from 'react';
import NextHead from 'next/head';
import { useStoreContext } from '~/store';
import useAuthToken from '~/hooks/useAuthToken';

const Head: FC = memo(() => {
  const [auth] = useAuthToken();
  const { title } = useStoreContext();

  return <NextHead>
    <meta name="viewport" content="initial-scale=1, width=device-width"/>
    <title>{auth ? (title ? `${title} - ` : '') : 'ログイン - '}Reservation System</title>
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
