import type { ThemeColor } from '~/types';
import { useCallback } from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useDarkMode = (): [ThemeColor, () => void, (value: boolean) => void] => {
  const [enabledState, setEnabledState] = useLocalStorage('dark-mode-enabled', useMediaQuery('(prefers-color-scheme: dark)'));
  const toggleEnabledState = useCallback(() => {
    setEnabledState(!enabledState);
  }, [enabledState]);
  return [enabledState ? 'dark' : 'light', toggleEnabledState, setEnabledState];
};

export default useDarkMode;
