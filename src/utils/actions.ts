import type { UseToastOptions } from '@chakra-ui/react';
import type { PageKeys } from '~/_pages';

type Dispatch = ((value: { type: string; [key: string]: any }) => void);

export const setAdmin = (dispatch: Dispatch, admin: { name?: string; icon?: string }) => dispatch({
  type: 'SET_ADMIN',
  admin,
});

export const openSidebar  = (dispatch: Dispatch) => dispatch({ type: 'OPEN_SIDEBAR' });
export const closeSidebar = (dispatch: Dispatch) => dispatch({ type: 'CLOSE_SIDEBAR' });

export const changePage = (dispatch: Dispatch, page: PageKeys) => dispatch({ type: 'PAGE', page });
export const logout     = (dispatch: Dispatch) => dispatch({ type: 'LOGOUT' });

export const createToast        = (dispatch: Dispatch, option: UseToastOptions) => dispatch({
  type: 'TOAST',
  toasts: option,
});
export const createWarningToast = (dispatch: Dispatch, option: UseToastOptions) => createToast(dispatch, {
  ...option,
  status: 'warning',
});
export const createErrorToast   = (dispatch: Dispatch, option: UseToastOptions) => createToast(dispatch, {
  ...option,
  status: 'error',
});
