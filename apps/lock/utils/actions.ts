import type { Dispatch } from '@frourio-demo/types';

export const changeTitle = (dispatch: Dispatch, title?: string) => dispatch({ type: 'TITLE', title });

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
export const clearNotices = (dispatch: Dispatch): void => dispatch({ type: 'CLEAR_NOTICES' });
