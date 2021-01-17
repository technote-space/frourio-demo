export const getSkip = (perPage: number, page: number): number => page * perPage;
export const getCurrentPage = (perPage: number, totalCount: number, page: number): number => {
  const skip = getSkip(perPage, page);
  if (skip >= totalCount) {
    if (totalCount <= 0) {
      return 0;
    }
    return Math.floor((totalCount - 1) / perPage);
  }

  return page;
};
