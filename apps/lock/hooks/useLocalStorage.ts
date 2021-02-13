import { useCallback } from 'react';
import { useStoreContext, useDispatchContext } from '#/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStoreValue = <T>(key: string, localStorage: Record<string, any> | undefined, initialValue: T): T => {
  if (localStorage && key in localStorage) {
    return localStorage[key];
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);
    return initialValue;
  }
};

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const { dispatch } = useDispatchContext();
  const { localStorage } = useStoreContext();
  const storedValue = getStoreValue(key, localStorage, initialValue);

  const setValue = useCallback((value: T): void | never => {
    dispatch({ type: 'LOCAL_STORAGE_CHANGED', key, value });
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [storedValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
