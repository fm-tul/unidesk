export const toCamelCase = (str: string) => {
  return str.length > 0 ? str.substring(0, 1).toLowerCase() + str.substring(1) : str;
};

export const toTrueFalseNullable = (value: any) => {
  const strValue = value?.toString().toLowerCase() || "";
  if (strValue === "true" || strValue === "1" || strValue === "yes") {
    return true;
  }
  if (strValue === "false" || strValue === "0" || strValue === "no") {
    return false;
  }
  return null;
};

export const toTrueFalse = (value: any, def: boolean = false) => {
  return toTrueFalseNullable(value) || def;
};


export const previewText = (text: string|null|undefined, maxLength: number) => {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  // take into account the ellipsis, split the text on word boundaries
  const preview = text.substring(0, maxLength - 3).split(" ").slice(0, -1).join(" ");
  return preview.length < text.length ? `${preview}...` : preview; 
}

export const takeLastPart = (str: string|undefined|null, separator: string = ".") => {
  if (!str) {
    return "";
  }

  const parts = str.split(separator);
  return parts[parts.length - 1];
}

export const takeFirstPart = (str: string|undefined|null, separator: string = ".") => {
  if (!str) {
    return "";
  }

  const parts = str.split(separator);
  return parts[0];
}
