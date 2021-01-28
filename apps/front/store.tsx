import React, { useReducer, createContext, useContext, useMemo } from 'react';
import type { FC } from 'react';
import type { Dispatch } from '@frourio-demo/types';
import type { ContextState, NoticeType } from '^/types';

const initialState: ContextState = {
  name: undefined,
  icon: undefined,
  page: 'top',
  title: undefined,
  notices: [] as NoticeType[],
  onRemoveToken: false,
  onRefreshToken: false,
} as const;

const reducerActions = {
  SET_GUEST: (store, action) => ({
    ...store,
    name: action.guest.name ?? action.guest.email,
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
  TOKEN_REMOVED: (store) => ({ ...store, onRemoveToken: false, page: 'top' }),
  ON_REFRESH_TOKEN: (store) => ({ ...store, onRefreshToken: true }),
  OFF_REFRESH_TOKEN: (store) => ({ ...store, onRefreshToken: false }),
  SET_NOTICE: (store, action) => ({
    ...store,
    notices: store.notices.concat({
      title: action.title,
      description: action.description,
      status: 'info',
    }),
  }),
  SET_ERROR: (store, action) => ({
    ...store,
    notices: store.notices.concat({
      title: action.title,
      description: action.description,
      status: 'error',
    }),
  }),
  SET_WARNING: (store, action) => ({
    ...store,
    notices: store.notices.concat({
      title: action.title,
      description: action.description,
      status: 'warning',
    }),
  }),
  CLEAR_NOTICES: (store) => ({ ...store, notices: [] }),
  LOCAL_STORAGE_CHANGED: (store, action) => ({
    ...store, localStorage: {
      ...store.localStorage,
      [action.key]: action.value,
    },
  }),
} as const;

const reducer = (store, action) => {
  console.log(action);
  /* istanbul ignore next */
  if (action.type in reducerActions) {
    return reducerActions[action.type](store, action);
  }

  /* istanbul ignore next */
  return store;
};

const StoreContext = createContext<ContextState>(initialState);
const useStoreContext = () => {
  return useContext(StoreContext);
};

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
