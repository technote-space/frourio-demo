import { depend } from 'velona';
import fetch from 'node-fetch';
import { auth0 } from '@frourio-demo/config';

type Info = {
  email: string;
  auth0Sub: string;
}
export const verifyCode = depend(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { fetch: fetch as (url: string, init: { headers: Record<string, string> }) => Promise<{ ok: boolean; json: () => Promise<any> }> },
  async({ fetch }, accessToken: string): Promise<Info | false> => {
    const response = await fetch(`https://${auth0.domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const info = await response.json();
    return {
      email: info.email,
      auth0Sub: info.sub,
    };
  },
);
