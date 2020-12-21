import { useRouter } from 'next/router';
import { useStoreContext } from '~/store';

const useAuthToken = (): string | undefined => {
  const router        = useRouter();
  const { authToken } = useStoreContext();
  if (!authToken) {
    if (typeof window !== 'undefined' && router.route !== '/login') {
      router.replace('/login').then();
    }
  }

  return authToken;
};

export default useAuthToken;
