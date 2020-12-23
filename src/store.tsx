import React, { useReducer, createContext, useContext, useMemo } from 'react';
import type { FC, Dispatch } from 'react';
import { ContextState } from '~/types';

const initialState: ContextState = {
  name: undefined,
  icon: undefined,
  isSidebarOpen: false,
};

const reducer = (store, action) => {
  console.log(action);
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'OPEN_SIDEBAR':
      return { ...store, isSidebarOpen: true };
    case 'CLOSE_SIDEBAR':
      return { ...store, isSidebarOpen: false };
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
