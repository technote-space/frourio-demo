export const getSession = async <T>(key: string, generator: () => Promise<T | undefined>, setter?: (value: any) => void): Promise<T | undefined> => {
  const value = sessionStorage.getItem(key);
  if (null === value) {
    const result = await generator();
    if (undefined !== result && setter) {
      setter(result);
    }

    return result;
  }

  return JSON.parse(value);
};
export const setSession = (key: string, value: any): void => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

// export const getAuthTokenCache   = async(generator: () => Promise<string | undefined>) => getSession(`authToken`, generator, setAuthTokenCache);
// export const setAuthTokenCache   = (value: string) => setSession(`authToken`, value);
// export const clearAuthTokenCache = () => sessionStorage.removeItem(`authToken`);
