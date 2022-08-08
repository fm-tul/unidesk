export const mergeModels = <T>(initialValues: T, partialValues: any) => {
  // if some value in partialValues is null, replace it with initialValues one
  let result: any = {};
  for (let key in partialValues) {
    if (partialValues[key] === null) {
      result[key] = (initialValues as any)[key] as any;
    } else {
      result[key] = partialValues[key];
    }
  }
  // add rest of initialValues
  for (let key in initialValues) {
    if (!result.hasOwnProperty(key)) {
      result[key] = initialValues[key];
    }
  }
  return result as T;
};
