export function* product<T>(items: T[][]): Generator<T[]> {
  const remainder = items.length > 1 ? product(items.slice(1)) : [[]];
  for (let r of remainder) for (let h of items.at(0)!) yield [h, ...r];
}
