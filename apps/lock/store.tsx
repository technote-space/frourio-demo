import { useReducer, createContext, useContext, useMemo } from 'react';
import type { FC } from 'react';
import type { Dispatch } from '@frourio-demo/types';
import type { ContextState, NoticeType } from '#/types';

const initialState: ContextState = {
  title: undefined,
  notices: [] as NoticeType[],
} as const;

const reducerActions = {
  TITLE: (store, action) => ({ ...store, title: action.title }),
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
