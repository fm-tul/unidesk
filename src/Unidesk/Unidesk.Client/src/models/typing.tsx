import { TrackedEntityDto } from "@models/TrackedEntityDto";
import { EditorProperty } from "./EditorProperty";
import * as Yup from "yup";
import { IdRenderer } from "./cellRenderers/IdRenderer";
import { DateOnlyRenderer } from "./cellRenderers/DateOnlyRenderer";
import { ColumnDefinition, TId } from "ui/Table";
import { MdCalendarToday } from "react-icons/md";
import { MetadataRenderer } from "./cellRenderers/MetadataRenderer";
import { LanguagesId } from "@locales/all";
import { ZodObject } from "zod";
import { FormErrors } from "utils/forms";
import { useState } from "react";

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

export const extractInitialValues = <T,>(schema: EditorPropertiesOf<T>) => {
  const result: any = {};
  Object.keys(schema).forEach(key => {
    const propSchema = (schema as any)[key] as EditorProperty;
    result[key] = propSchema.value;
  });
  return result as { [K in keyof typeof schema]: string };
};

export const extractYupSchema = <T,>(schema: EditorPropertiesOf<T>) => {
  const result: any = {};
  Object.keys(schema).forEach(key => {
    const propSchema = (schema as any)[key] as EditorProperty;
    result[key] = propSchema.required ? Yup.string().required("required") : Yup.string().nullable();
  });
  return Yup.object({ ...result });
};

export const extractColDefinition = <T extends TId>(schema: EditorPropertiesOf<T>, language: LanguagesId) => {
  // add ID
  const cols: ColumnDefinition<T>[] = [
    {
      id: "id",
      field: IdRenderer,
      headerName: "ID",
      style: { width: 90 },
      className: "",
    },
  ];

  // add other columns
  Object.entries(schema)
    .filter(([key, _]) => key !== "id")
    .forEach(([key, propSchema]) => {
      cols.push({
        id: key as keyof T,
        field: propSchema.type === "date" ? v => DateOnlyRenderer(v, key, language) : (key as keyof T),
        headerName: key,
      });
    });

  // add metadata column
  cols.push({
    id: "created" as keyof T,
    field: v => MetadataRenderer(v as unknown as TrackedEntityDto, language),
    headerName: <MdCalendarToday />,
    style: { width: 90 },
    className: "",
  });

  return cols;
};
