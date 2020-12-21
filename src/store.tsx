import React, { useReducer, createContext, useContext, useMemo, FC } from 'react';
import { ContextState } from '$/types';

const initialState: ContextState = {
  authToken: undefined,
};

const reducer = (store, action) => {
  switch (action.type) {
    case 'INIT':
      return initialState;
    case 'AUTH_TOKEN':
      return { ...store, authToken: action.authToken };
    default:
      return store;
  }
};

const StoreContext    = createContext<ContextState>({});
const useStoreContext = () => {
  return useContext(StoreContext);
};

const DispatchContext    = createContext({});
const useDispatchContext = () => {
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
