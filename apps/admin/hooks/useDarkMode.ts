import type { ThemeColor } from '~/types';
import { useCallback } from 'react';
import { useStoreContext, useDispatchContext } from '~/store';
import useLocalStorage from '@technote-space/use-local-storage';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useDarkMode = (): [ThemeColor, () => void, (value: boolean) => void] => {
  const { dispatch } = useDispatchContext();
  const { localStorage } = useStoreContext();
  const [enabledState, setEnabledState] = useLocalStorage('dark-mode-enabled', useMediaQuery('(prefers-color-scheme: dark)'), {
    storage: localStorage,
    onChanged: (key, value) => {
      dispatch({ type: 'LOCAL_STORAGE_CHANGED', key, value });
    },
  });
  const toggleEnabledState = useCallback(() => {
    setEnabledState(!enabledState);
  }, [enabledState]);
  return [enabledState ? 'dark' : 'light', toggleEnabledState, setEnabledState];
};

export default useDarkMode;
