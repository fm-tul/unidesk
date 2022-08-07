export interface PersistedEnvelope<T> {
  item: T;
  date: number;
}
export const persistObject = <T>(key: string, data: T) => {
  const envelope: PersistedEnvelope<T> = {
    item: data,
    date: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(envelope));
};

export const getPersistedObject = <T>(key: string) => {
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as PersistedEnvelope<T>) : null;
};

export const hasPersistedObject = (key: string) => {
  return localStorage.getItem(key) !== null;
};

export const deletePersistedObject = (key: string) => {
  localStorage.removeItem(key);
};
