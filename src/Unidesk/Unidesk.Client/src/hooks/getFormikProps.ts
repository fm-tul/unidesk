export const getFormikProps = <T>(formik: any, prop: keyof T, size = "sm", fullWidth = true) => {
  const helperColor = !!formik.errors[prop] && !!formik.touched[prop];
  const helperText = helperColor ? formik.errors[prop] : null;
  const restProps = formik.getFieldProps(prop);

  return { helperColor, helperText, ...restProps, size, fullWidth };
};

export const getFormikPropsSelect = <T>(formik: any, prop: keyof T, size = "small", fullWidth = true) => {
  const error = !!formik.errors[prop] && !!formik.touched[prop];
  const restProps = formik.getFieldProps(prop);

  return { error, ...restProps, size, fullWidth };
};

export const getFormikPropsSelect2 = <T>(formik: any, prop: keyof T, size = "small", fullWidth = true) => {
  const error = !!formik.errors[prop] && !!formik.touched[prop];
  const restProps = formik.getFieldProps(prop);
  const value = formik.values[prop];
  const onChange = (v: any) => formik.setFieldValue(prop, v);

  return { value, onChange };
};