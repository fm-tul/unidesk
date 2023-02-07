interface AutoSaveObject<T> {
  dt: number;
  value: T;
}

interface LocalStorageAutoSave<T> {
  items: AutoSaveObject<T>[];
}

// This hook is used to save a value to local storage and retrieve it later.
// it support versioning of the data
export const useAutoSave = <T>(key: string, limit = 30, delayMs = 10_000, initalValue: T | undefined = undefined) => {
  const localStorageKey = `autosave.${key}`;

  const getValue = () => {
    const item = window.localStorage.getItem(localStorageKey);
    if (item) {
      const data: LocalStorageAutoSave<T> = JSON.parse(item);
      return data;
    }
    return undefined;
  };

  const saveValue = (value: T) => {
    const dt = Date.now();
    const item = getValue();
    if (!item) {
      const data: LocalStorageAutoSave<T> = {
        items: [{ dt, value }],
      };
      window.localStorage.setItem(localStorageKey, JSON.stringify(data));
      return;
    }

    const latest = item.items[item.items.length - 1]!;
    const diff = dt - latest.dt;
    if (diff > delayMs) {
      item.items.push({ dt, value });
      if (item.items.length > limit) {
        item.items.shift();
      }
      window.localStorage.setItem(localStorageKey, JSON.stringify(item));
    }
  };

  const destroyHistory = () => {
    window.localStorage.removeItem(localStorageKey);
  };

  return { getValue, saveValue, destroyHistory };
};
