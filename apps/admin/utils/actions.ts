import type { Dispatch } from '@frourio-demo/types';
import type { PageKeys } from '~/_pages';

export const setAdmin = (dispatch: Dispatch, admin: { name?: string | null; icon?: string | null }) => dispatch({
  type: 'SET_ADMIN',
  admin,
});

export const openSidebar = (dispatch: Dispatch) => dispatch({ type: 'OPEN_SIDEBAR' });
export const closeSidebar = (dispatch: Dispatch) => dispatch({ type: 'CLOSE_SIDEBAR' });
export const openLicense = (dispatch: Dispatch) => dispatch({ type: 'OPEN_LICENSE' });
export const closeLicense = (dispatch: Dispatch) => dispatch({ type: 'CLOSE_LICENSE' });

export const changePage = (dispatch: Dispatch, page: PageKeys) => dispatch({ type: 'PAGE', page });
export const changeTitle = (dispatch: Dispatch, title: string) => dispatch({ type: 'TITLE', title });
export const logout = (dispatch: Dispatch) => dispatch({ type: 'LOGOUT' });
export const tokenRemoved = (dispatch: Dispatch) => dispatch({ type: 'TOKEN_REMOVED' });
export const onRefreshToken = (dispatch: Dispatch) => dispatch({ type: 'ON_REFRESH_TOKEN' });
export const offRefreshToken = (dispatch: Dispatch) => dispatch({ type: 'OFF_REFRESH_TOKEN' });

export const setNotice = (dispatch: Dispatch, message: string): void => dispatch({
  type: 'SET_NOTICE',
  notice: { message },
});
export const setError = (dispatch: Dispatch, message: string): void => dispatch({
  type: 'SET_ERROR',
  notice: { message },
});
export const setWarning = (dispatch: Dispatch, message: string): void => dispatch({
  type: 'SET_WARNING',
  notice: { message },
});
export const closeNotice = (dispatch: Dispatch): void => dispatch({ type: 'CLOSE_NOTICE' });
