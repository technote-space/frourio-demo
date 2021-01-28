import { createBrowserHistory, createMemoryHistory } from 'history';

const history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();
export default history;
