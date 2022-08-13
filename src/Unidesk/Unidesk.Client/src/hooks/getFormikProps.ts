export const getFormikProps = <T>(formik: any, prop: keyof T, size = "sm", fullWidth = true) => {
  const error = !!formik.errors[prop] && !!formik.touched[prop];
  const helperText = error ? formik.errors[prop] : null;
  const restProps = formik.getFieldProps(prop);

  return { error, helperText, ...restProps, size, fullWidth };
};

export const getFormikPropsSelect = <T>(formik: any, prop: keyof T, size = "small", fullWidth = true) => {
  const error = !!formik.errors[prop] && !!formik.touched[prop];
  const restProps = formik.getFieldProps(prop);

  return { error, ...restProps, size, fullWidth };
};
