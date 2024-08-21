import { Piper } from "./Piper";
import { piper, type PiperType } from "./createPiper";

export type MappedItem<K, V> = { key: K, value: V };
export type MapFn<K, V, O> = (record: MappedItem<K, V>, index: number) => O;

export class MapPiper<K, V> extends Piper<Map<K, V>> {
  map<U>(fn: MapFn<K, V, U>) {
    const entries = Array.from(this.value.entries());
    const mapped = entries.map(([key, value], index) => fn({ key, value }, index));
    return piper(mapped);
  }

  async mapAwaitAll<U>(fn: MapFn<K, V, Promise<U>>) {
    const entries = Array.from(this.value.entries());
    const mapped = await Promise.all(entries.map(async ([key, value], index) => fn({ key, value }, index)));
    return piper(mapped);
  }

  async mapAwait<U>(fn: MapFn<K, V, Promise<U>>) {
    const entries = Array.from(this.value.entries());
    let result: U[] = [];
    for (let i = 0; i < entries.length; i++) {
      result.push(await fn({ key: entries[i][0], value: entries[i][1] }, i));
    }
    return piper(result);
  }

  mapValues<U>(fn: MapFn<K, V, U>) {
    const entries = Array.from(this.value.entries());
    const mapped = entries.map(([key, value], index) => [key, fn({ key, value }, index)] as const);
    return piper(new Map<K, U>(mapped));
  }

  async mapValuesAwaitAll<U>(fn: MapFn<K, V, Promise<U>>) {
    const entries = Array.from(this.value.entries());
    const mapped = await Promise.all(entries.map(async ([key, value], index) => [key, await fn({ value, key }, index)] as const));
    return piper(new Map<K, U>(mapped));
  }
  
  async mapValuesAwait<U>(fn: MapFn<K, V, Promise<U>>) {
    const entries = Array.from(this.value.entries());
    let result = new Map<K, U>();
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      result.set(key, await fn({ key, value }, i));
    }
    return piper(result);
  }
  
  mapKeys<U>(fn: MapFn<K, V, U>) {
    const entries = Array.from(this.value.entries());
    const mapped = entries.map(([key, value], index) => [fn({ key, value }, index), value] as const);
    return piper(new Map<U, V>(mapped));
  }

  async mapKeysAwaitAll<U>(fn: MapFn<K, V, Promise<U>>) {
    const entries = Array.from(this.value.entries());
    const mapped = await Promise.all(entries.map(async ([key, value], index) => [await fn({ key, value }, index), value] as const));
    return piper(new Map<U, V>(mapped));
  }

  async mapKeysAwait<U>(fn: MapFn<K, V, Promise<U>>) {
    const entries = Array.from(this.value.entries());
    let result = new Map<U, V>();
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      result.set(await fn({ key, value }, i), value);
    }
    return piper(result);
  }
  
  filter(fn: MapFn<K, V, boolean>) {
    const entries = Array.from(this.value.entries());
    const filtered = entries.filter(([key, value], index) => fn({ key, value }, index));
    return piper(new Map<K, V>(filtered));
  }

  reject(fn: MapFn<K, V, boolean>) {
    const entries = Array.from(this.value.entries());
    const filtered = entries.filter(([key, value], index) => !fn({ key, value }, index));
    return piper(new Map<K, V>(filtered));
  }

  reduce<U>(initialValue: U, fn: (acc: U, record: MappedItem<K, V>, index: number) => U) {
    const entries = Array.from(this.value.entries());
    return piper(entries.reduce((acc, [key, value], index) => fn(acc, { key, value }, index), initialValue));
  }
  
  async reduceAwait<U>(initialValue: U, fn: (acc: U, record: MappedItem<K, V>, index: number) => Promise<U>) {
    const entries = Array.from(this.value.entries());
    let acc = initialValue;
    for (let i = 0; i < entries.length; i++) {
      acc = await fn(acc, { key: entries[i][0], value: entries[i][1] }, i);
    }
    return piper(acc);
  }

  omitKeys(...keys: K[]) {
    const entries = Array.from(this.value.entries());
    const filtered = entries.filter(([key]) => !keys.includes(key));
    return piper(new Map<K, V>(filtered));
  }

  omitValues(...values: V[]) {
    const entries = Array.from(this.value.entries());
    const filtered = entries.filter(([, value]) => !values.includes(value));
    return piper(new Map<K, V>(filtered));
  }

  omitKey(key: K) {
    return this.omitKeys(key);
  }
  
  omitValue(value: V) {
    return this.omitValues(value);
  }
  
  omitEntries(...entries: [K, V][]) {
    const entriesMap = new Map(entries);
    return this.reject(({ key, value }) => entriesMap.has(key) && entriesMap.get(key) === value);
  }

  omitEntry(entry: [K, V]) {
    return this.omitEntries(entry);
  }
  
  keys() {
    return piper(Array.from(this.value.keys()));
  }

  values() {
    return piper(Array.from(this.value.values()));
  }

  entries() {
    return piper(Array.from(this.value.entries()));
  }

  valuesOf(...keys: K[]) {
    return piper(keys.map(key => this.value.get(key)));
  }

  valueOf(key: K) {
    return piper(this.value.get(key));
  }
  
  any(fn: MapFn<K, V, boolean>) {
    const entries = Array.from(this.value.entries());
    return piper(entries.some(([key, value], index) => fn({ key, value }, index)));
  }

  all(fn: MapFn<K, V, boolean>) {
    const entries = Array.from(this.value.entries());
    return piper(entries.every(([key, value], index) => fn({ key, value }, index)));
  }

  none(fn: MapFn<K, V, boolean>) {
    const entries = Array.from(this.value.entries());
    return piper(entries.every(([key, value], index) => !fn({ key, value }, index)));
  }
  
  hasKey(key: K) {
    return piper(this.value.has(key));
  }

  hasValue(value: V) {
    return piper(Array.from(this.value.values()).includes(value));
  }
  
  forEach(fn: MapFn<K, V, any>) {
    const entries = Array.from(this.value.entries());
    entries.forEach(([key, value], index) => fn({ key, value }, index));
  }

  async forEachAwait(fn: MapFn<K, V, Promise<any>>) {
    const entries = Array.from(this.value.entries());
    for (let i = 0; i < entries.length; i++) {
      await fn({ key: entries[i][0], value: entries[i][1] }, i);
    }
  }

  compact() {
    return this.reject(({ value }) => value == null);
  }

  isEmpty() {
    return piper(this.value.size === 0);
  }

  length() {
    return piper(this.value.size);
  }
}