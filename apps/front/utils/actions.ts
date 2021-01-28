import type { Dispatch } from '@frourio-demo/types';

export const setGuest = (dispatch: Dispatch, guest: { name?: string }) => dispatch({
  type: 'SET_GUEST',
  guest,
});

export const changeTitle = (dispatch: Dispatch, title?: string) => dispatch({ type: 'TITLE', title });
export const logout = (dispatch: Dispatch) => dispatch({ type: 'LOGOUT' });
export const tokenRemoved = (dispatch: Dispatch) => dispatch({ type: 'TOKEN_REMOVED' });
export const onRefreshToken = (dispatch: Dispatch) => dispatch({ type: 'ON_REFRESH_TOKEN' });
export const offRefreshToken = (dispatch: Dispatch) => dispatch({ type: 'OFF_REFRESH_TOKEN' });

export const setNotice = (dispatch: Dispatch, description: string, title?: string): void => dispatch({
  type: 'SET_NOTICE',
  title,
  description,
});
export const setError = (dispatch: Dispatch, description: string, title?: string): void => dispatch({
  type: 'SET_ERROR',
  title,
  description,
});
export const setWarning = (dispatch: Dispatch, description: string, title?: string): void => dispatch({
  type: 'SET_WARNING',
  title,
  description,
});
export const clearNotices = (dispatch: Dispatch): void => dispatch({ type: 'CLEAR_NOTICES' });
