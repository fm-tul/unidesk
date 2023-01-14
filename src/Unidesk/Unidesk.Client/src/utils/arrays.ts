/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
  const map = new Map<K, Array<V>>();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())];
}

export function distinctBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Array<V> {
  return [...groupBy(list, keyGetter).values()].map(v => v[0]);
}

export function distinct<T>(list: Array<T>): Array<T> {
  // preserve order
  return list.filter((v, i, a) => a.indexOf(v) === i);
}

export function sortBy<K, V>(list: Array<V>, keyGetter: (input: V) => K, reverse = false): Array<V> {
  const reverseMultiplier = reverse ? -1 : 1;
  return list.sort((a, b) => {
    const keyA = keyGetter(a);
    const keyB = keyGetter(b);
    if (keyA < keyB) {
      return -1 * reverseMultiplier;
    }
    if (keyA > keyB) {
      return 1 * reverseMultiplier;
    }
    return 0;
  });
}

export const addId = <T>(items: T[], func: (item: T) => string) => {
  return items.map(item => ({ ...item, id: func(item) }));
};

/**
 * Returns a new array without the items given
 * @param items
 * @param exceptItems
 * @returns
 */
export const except = <T>(items: T[], exceptItems: T[] | T) => {
  const exceptArray = Array.isArray(exceptItems) ? exceptItems : [exceptItems];
  return items.filter(item => !exceptArray.includes(item));
};

/**
 * Returns a new array without the items given, only if first array contains something other than the items given
 * @param items
 * @param exceptItems
 * @returns
 */
export const exceptIf = <T>(items: T[], exceptItems: T[] | T) => {
  const exceptArray = Array.isArray(exceptItems) ? exceptItems : [exceptItems];
  const containsOtherThanExcept = items.some(item => !exceptArray.includes(item));
  const newArray = containsOtherThanExcept ? except(items, exceptArray) : items;
  if (newArray.length === 0) {
    return exceptArray;
  }
  return newArray;
};

/**
 * keep only truthy values
 */
export const compact = <T>(items: T[], defaultValue?: T) => {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0 && defaultValue) {
    return [defaultValue];
  }
  return filtered;
};
