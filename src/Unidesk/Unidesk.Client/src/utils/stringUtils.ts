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


export const joinPretty = <T>(arr: T[], and: string, separator: string = ", ") => {
  if (arr.length === 0) {
    return "";
  }
  if (arr.length === 1) {
    return arr[0];
  }
  if (arr.length === 2) {
    return `${arr[0]} ${and} ${arr[1]}`;
  }
  return `${arr.slice(0, -1).join(separator)} ${and} ${arr[arr.length - 1]}`;
}

export const mapComplex = <T>(arr: T[], and: string, separator: string = ", ", mapper: (item: T|null, concatStr: string|null, index: number) => any) => {
  const len = arr.length;
  if (len === 0) {
    return [];
  }
  if (len === 1) {
    return arr.map(i => mapper(i, null, 0));
  }
  if (len === 2) {
    return [
      mapper(arr[0], null, 0),
      mapper(null, and, 1),
      mapper(arr[1], null, 2)
    ];
  }
  
  const items = [];
  let j = 0;
  for (let i = 0; i < len - 2; i++) {
    items.push(mapper(arr[i], null, j++));
    items.push(mapper(null, separator, j++));
  }
  items.push(mapper(arr[len - 2], null, j++));
  items.push(mapper(null, and, j++));
  items.push(mapper(arr[len - 1], null, j++));
  return items;
}


export const isNullOrEmpty = (str: string|null|undefined) => {
  return !str || str.trim().length === 0;
}


export const isAllNotNullOrEmpty = (...strs: (string|null|undefined)[]) => {
  return strs.every(s => !isNullOrEmpty(s));
}

// find links in text and replace them with <a> tags
export const enrichPlaintext = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });
}