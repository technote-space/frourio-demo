import React, { useReducer, createContext, useContext, useMemo } from 'react';
import type { FC, Dispatch as _Dispatch } from 'react';
import { ContextState } from '~/types';

const initialState: ContextState = {
  name: undefined,
  icon: undefined,
  isSidebarOpen: false,
  isLicenseOpen: false,
  page: 'dashboard',
  title: undefined,
  notice: {
    open: false,
    message: '',
    variant: 'success',
  },
};

const reducer = (store, action) => {
  console.log(action);
  switch (action.type) {
    case 'SET_ADMIN':
      return { ...store, name: action.admin.name, icon: action.admin.icon };
    case 'OPEN_SIDEBAR':
      return { ...store, isSidebarOpen: true };
    case 'CLOSE_SIDEBAR':
      return { ...store, isSidebarOpen: false };
    case 'OPEN_LICENSE':
      return { ...store, isLicenseOpen: true };
    case 'CLOSE_LICENSE':
      return { ...store, isLicenseOpen: false };
    case 'PAGE':
      return { ...store, page: action.page };
    case 'TITLE':
      return { ...store, title: action.title };
    case 'LOGOUT':
      return { ...store, name: undefined, icon: undefined, title: undefined };
    case 'SET_NOTICE':
      return { ...store, notice: { ...store.notice, ...{ open: true, variant: 'success' }, ...action.notice } };
    case 'SET_ERROR':
      return { ...store, notice: { ...store.notice, ...{ open: true, variant: 'error' }, ...action.notice } };
    case 'SET_WARNING':
      return { ...store, notice: { ...store.notice, ...{ open: true, variant: 'warning' }, ...action.notice } };
    case 'CLOSE_NOTICE':
      return { ...store, notice: { ...store.notice, ...{ open: false } } };
    case 'LOCAL_STORAGE_CHANGED':
      return {
        ...store, localStorage: {
          ...store.localStorage,
          [action.key]: action.value,
        },
      };
    /* istanbul ignore next */
    default:
      /* istanbul ignore next */
      return store;
  }
};

const StoreContext = createContext<ContextState>(initialState);
const useStoreContext = () => {
  return useContext(StoreContext);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dispatch = _Dispatch<{ type: string, [key: string]: any; }>;
type DispatchContextType = { dispatch: Dispatch };
const DispatchContext = createContext<DispatchContextType>({} as DispatchContextType);
const useDispatchContext = (): DispatchContextType => {
  return useContext(DispatchContext);
};

const StoreContextProvider: FC = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState);

  return useMemo(
    () =>
      <StoreContext.Provider value={{ ...store }}>
        <DispatchContext.Provider value={{ dispatch }}>
          {children}
        </DispatchContext.Provider>
      </StoreContext.Provider>,
    [store],
  );
};

export {
  initialState,
  useStoreContext,
  useDispatchContext,
  StoreContextProvider,
};
