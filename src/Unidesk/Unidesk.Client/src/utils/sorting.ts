export const sortBy = <T>(arr: T[], getter: (item: T) => string) => {
  return arr.sort((a, b) => {
    const aVal = getter(a);
    const bVal = getter(b);
    if (aVal < bVal) {
      return -1;
    }
    if (aVal > bVal) {
      return 1;
    }
    return 0;
  });
};
