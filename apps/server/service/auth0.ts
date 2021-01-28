import fetch from 'node-fetch';
import { AUTH0_DOMAIN } from '$/service/env';

type Info = {
  email: string;
  auth0Sub: string;
}
export const verifyCode = async(accessToken: string): Promise<Info | false> => {
  const response = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
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
};