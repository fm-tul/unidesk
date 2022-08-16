import { TrackedEntityDto } from "@models/TrackedEntityDto";
import { EditorProperty } from "./EditorProperty";
import * as Yup from "yup";
import { IdRenderer } from "./cellRenderers/IdRenderer";
import { DateOnlyRendererFor } from "./cellRenderers/DateOnlyRenderer";

export type FilterFlags<Base, T> = {
  [K in keyof Base]: Base[K] extends T ? K : never;
};
export type AllowedNames<Base, T> = FilterFlags<Base, T>[keyof Base];
export type NamesIntersection<T> = Exclude<AllowedNames<T, string>, AllowedNames<TrackedEntityDto, string>>;
export type EditorPropertiesOf<T> = {
  [K in Exclude<AllowedNames<T, string>, AllowedNames<TrackedEntityDto, string>>]: EditorProperty;
} & {
  id: EditorProperty;
};

export const extractInitialValues = <T>(schema: EditorPropertiesOf<T>) => {
  const result: any = {};
  Object.keys(schema).forEach(key => {
    const propSchema = (schema as any)[key] as EditorProperty;
    result[key] = propSchema.value;
  });
  return result as { [K in keyof typeof schema]: string };
};

export const extractYupSchema = <T>(schema: EditorPropertiesOf<T>) => {
  const result: any = {};
  Object.keys(schema).forEach(key => {
    const propSchema = (schema as any)[key] as EditorProperty;
    result[key] = propSchema.required ? Yup.string().required("required") : Yup.string().nullable();
  });
  return Yup.object({ ...result });
};

export const extractColDefinition = <T>(schema: EditorPropertiesOf<T>) => {
  const cols: any[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      renderCell: IdRenderer,
    },
  ];

  Object.keys(schema)
    .filter(i => i !== "id")
    .forEach(key => {
      const propSchema = (schema as any)[key] as EditorProperty;
      cols.push({
        field: key,
        flex: 1,
        renderCell: propSchema.type === "date" ? DateOnlyRendererFor(key) : undefined,
      });
    });

  return cols;
};