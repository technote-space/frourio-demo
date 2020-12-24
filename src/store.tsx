import React, { useReducer, createContext, useContext, useMemo } from 'react';
import type { FC, Dispatch } from 'react';
import { ContextState } from '~/types';

const initialState: ContextState = {
  name: undefined,
  icon: undefined,
  isSidebarOpen: false,
  loadingModal: {
    isOpen: false,
  },
  page: 'dashboard',
  prevPage: undefined,
};

const reducer = (store, action) => {
  console.log(action);
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'SET_ADMIN':
      return { ...store, name: action.admin.name, icon: action.admin.icon };
    case 'OPEN_SIDEBAR':
      return { ...store, isSidebarOpen: true };
    case 'CLOSE_SIDEBAR':
      return { ...store, isSidebarOpen: false };
    case 'LOADING_MODAL':
      return { ...store, loadingModal: action.loadingModal };
    case 'PAGE':
      if ('logout' === store.page) {
        return { ...store, page: action.page };
      }

      return { ...store, prevPage: store.page, page: action.page };
    case 'LOGOUT':
      return { ...store, name: undefined, icon: undefined, page: store.prevPage };
    default:
      return store;
  }
};

const StoreContext    = createContext<ContextState>(initialState);
const useStoreContext = () => {
  return useContext(StoreContext);
};

type DispatchContextType = { dispatch: Dispatch<{ type: string, [key: string]: any }> };
const DispatchContext    = createContext<DispatchContextType>({} as DispatchContextType);
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
