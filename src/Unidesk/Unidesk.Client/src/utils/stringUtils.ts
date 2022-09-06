export const toCamelCase = (str: string) => {
  return str.length > 0 ? str.substring(0, 1).toLowerCase() + str.substring(1) : str;
};
