export interface EditorProperty {
  value: string | null;
  required?: boolean;
  colspan?: number;
  hidden?: boolean;
  size?: "sm" | "md" | "lg";
  breakAfter?: boolean;
  type?: "string" | "date";
}
