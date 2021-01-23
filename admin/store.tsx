import React, { useReducer, createContext, useContext, useMemo } from 'react';
import type { FC, Dispatch as _Dispatch } from 'react';
import { ContextState } from '~/types';

const initialState: ContextState = {
  name: undefined,
  icon: undefined,
  roles: undefined,
  isSidebarOpen: false,
  isLicenseOpen: false,
  page: 'dashboard',
  title: undefined,
  notice: {
    open: false,
    message: '',
    variant: 'success',
  },
  onRemoveToken: false,
  onRefreshToken: false,
} as const;

const reducerActions = {
  SET_ADMIN: (store, action) => ({
    ...store,
    name: action.admin.name,
    icon: action.admin.icon,
    roles: action.admin.roles?.map((role: { role: string }) => role.role),
  }),
  OPEN_SIDEBAR: (store) => ({ ...store, isSidebarOpen: true }),
  CLOSE_SIDEBAR: (store) => ({ ...store, isSidebarOpen: false }),
  OPEN_LICENSE: (store) => ({ ...store, isLicenseOpen: true }),
  CLOSE_LICENSE: (store) => ({ ...store, isLicenseOpen: false }),
  PAGE: (store, action) => ({ ...store, page: action.page }),
  TITLE: (store, action) => ({ ...store, title: action.title }),
  LOGOUT: (store) => ({
    ...store,
    name: undefined,
    icon: undefined,
    title: undefined,
    roles: undefined,
    onRemoveToken: true,
  }),
  TOKEN_REMOVED: (store) => ({ ...store, onRemoveToken: false, page: 'dashboard' }),
  ON_REFRESH_TOKEN: (store) => ({ ...store, onRefreshToken: true }),
  OFF_REFRESH_TOKEN: (store) => ({ ...store, onRefreshToken: false }),
  SET_NOTICE: (store, action) => ({
    ...store,
    notice: { ...store.notice, ...{ open: true, variant: 'success' }, ...action.notice },
  }),
  SET_ERROR: (store, action) => ({
    ...store,
    notice: { ...store.notice, ...{ open: true, variant: 'error' }, ...action.notice },
  }),
  SET_WARNING: (store, action) => ({
    ...store,
    notice: { ...store.notice, ...{ open: true, variant: 'warning' }, ...action.notice },
  }),
  CLOSE_NOTICE: (store) => ({ ...store, notice: { ...store.notice, ...{ open: false } } }),
  LOCAL_STORAGE_CHANGED: (store, action) => ({
    ...store, localStorage: {
      ...store.localStorage,
      [action.key]: action.value,
    },
  }),
} as const;

const reducer = (store, action) => {
  console.log(action);
  if (action.type in reducerActions) {
    return reducerActions[action.type](store, action);
  }

  return store;
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
