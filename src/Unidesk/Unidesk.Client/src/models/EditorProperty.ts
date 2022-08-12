export interface EditorProperty {
  value: string | null;
  required?: boolean;
  colspan?: number;
  hidden?: boolean;
  size?: "small" | "medium";
  breakAfter?: boolean;
  type?: "string" | "date";
}
