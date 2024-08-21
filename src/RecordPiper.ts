import { Piper } from "./Piper";
import { piper, type PiperType } from "./createPiper";

export type MappedItem<K, V> = { key: K, value: V };
export type MapFn<V, O> = (record: MappedItem<string, V>, index: number) => O;

export class RecordPiper<V> extends Piper<Record<string, V>> {
  map<U>(fn: MapFn<V, U>) {
    const entries = Object.entries(this.value);
    const mapped = entries.map(([key, value], index) => fn({ key, value }, index));
    return piper(mapped)
  }
  
  async mapAwaitAll<U>(fn: MapFn<V, Promise<U>>) {
    const entries = Object.entries(this.value);
    const mapped = await Promise.all(entries.map(async ([key, value], index) => fn({ key, value }, index)));
    return piper(mapped)
  }
  
  async mapAwait<U>(fn: MapFn<V, Promise<U>>) {
    const entries = Object.entries(this.value);
    let result: U[] = [];
    for (let i = 0; i < entries.length; i++) {
      result.push(await fn({ key: entries[i][0], value: entries[i][1] }, i));
    }
    return piper(result);
  }
  
  mapValues<U>(fn: MapFn<V, U>) {
    const entries = Object.entries(this.value);
    const mapped = entries.reduce((acc, [key, value], index) => {
      acc[key] = fn({ key, value }, index);
      return acc;
    }, {} as Record<string, U>);
    return piper(mapped)
  }
  
  async mapValuesAwaitAll<U>(fn: MapFn<V, Promise<U>>) {
    const entries = Object.entries(this.value);
    const mapped = await Promise.all(entries.map(async ([key, value], index) => [key, await fn({ value, key }, index)]));
    return piper(Object.fromEntries(mapped))
  }
  
  async mapValuesAwait<U>(fn: MapFn<V, Promise<U>>) {
    const entries = Object.entries(this.value);
    let result: Record<string, U> = {};
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      result[key] = await fn({ key, value }, i);
    }
    return piper(result);
  }
  
  mapKeys(fn: MapFn<V, string>) {
    const entries = Object.entries(this.value);
    const mapped = entries.reduce((acc, [key, value], index) => {
      acc[fn({ key, value }, index)] = value;
      return acc;
    }, {} as Record<string, V>);
    return piper(mapped)
  }
  
  async mapKeysAwaitAll(fn: MapFn<V, Promise<string>>) {
    const entries = Object.entries(this.value);
    const mapped = await Promise.all(entries.map(async ([key, value], index) => [await fn({ key, value }, index), value]));
    return piper(Object.fromEntries(mapped))
  }

  async mapKeysAwait(fn: MapFn<V, Promise<string>>) {
    const entries = Object.entries(this.value);
    let result: Record<string, V> = {};
    for (let i = 0; i < entries.length; i++) {
      const [key, value] = entries[i];
      result[await fn({ key, value }, i)] = value;
    }
    return piper(result);
  }

  filter(fn: MapFn<V, boolean>) {
    const entries = Object.entries(this.value);
    const filtered = entries.filter(([key, value], index) => fn({ key, value }, index));
    return piper(Object.fromEntries(filtered));
  }
  
  reject(fn: MapFn<V, boolean>) {
    const entries = Object.entries(this.value);
    const filtered = entries.filter(([key, value], index) => !fn({ key, value }, index));
    return piper(Object.fromEntries(filtered));
  }
  
  reduce<U>(initialValue: U, fn: (acc: U, record: MappedItem<string, V>, index: number) => U) {
    const entries = Object.entries(this.value);
    return piper(entries.reduce((acc, [key, value], index) => fn(acc, { key, value }, index), initialValue));
  }
  
  async reduceAwait<U>(initialValue: U, fn: (acc: U, record: MappedItem<string, V>, index: number) => Promise<U>) {
    const entries = Object.entries(this.value);
    let acc = initialValue;
    for (let i = 0; i < entries.length; i++) {
      acc = await fn(acc, { key: entries[i][0], value: entries[i][1] }, i);
    }
    return piper(acc);
  }
  
  omitKeys(...keys: string[]) {
    const entries = Object.entries(this.value);
    const filtered = entries.filter(([key, _]) => !keys.includes(key));
    return piper(Object.fromEntries(filtered));
  }
  omitKey(key: string) {
    return this.omitKeys(key);
  }
  
  omitValues(...values: V[]) {
    const entries = Object.entries(this.value);
    const filtered = entries.filter(([_, value]) => !values.includes(value));
    return piper(Object.fromEntries(filtered));
  }
  omitValue(value: V) {
    return this.omitValues(value);
  }
  
  omitEntries(...entries: [string, V][]) {
    const entryData = Object.entries(this.value);
    const filtered = entryData.filter(([key, value]) => !entries.some(([k, v]) => k === key && v === value));
    return piper(Object.fromEntries(filtered));
  }
  omitEntry(entry: [string, V]) {
    return this.omitEntries(entry);
  }
  
  keys() {
    return piper(Object.keys(this.value));
  }

  values() {
    return piper(Object.values(this.value));
  }
  
  entries() {
    return piper(Object.entries(this.value));
  }

  valuesOf(...keys: string[]) {
    return piper(keys.map(key => this.value[key]));
  }

  valueOf(key: string) {
    return piper(this.value[key]);
  }
 
  any(fn: MapFn<V, boolean>) {
    const entries = Object.entries(this.value);
    return piper(entries.some(([key, value], index) => fn({ key, value }, index)));
  }

  all(fn: MapFn<V, boolean>) {
    const entries = Object.entries(this.value);
    return piper(entries.every(([key, value], index) => fn({ key, value }, index)));
  }

  none(fn: MapFn<V, boolean>) {
    const entries = Object.entries(this.value);
    return piper(!entries.some(([key, value], index) => fn({ key, value }, index)));
  }
  
  hasKey(key: string) {
    return piper(key in this.value);
  }
  
  hasValue(value: V) {
    return piper(Object.values(this.value).includes(value));
  }

  forEach(fn: MapFn<V, any>) {
    const entries = Object.entries(this.value);
    entries.forEach(([key, value], index) => fn({ key, value }, index));
  }
  
  async forEachAwait(fn: MapFn<V, Promise<any>>) {
    const entries = Object.entries(this.value);
    for (let i = 0; i < entries.length; i++) {
      await fn({ key: entries[i][0], value: entries[i][1] }, i);
    }
  }

  compact() {
    const entries = Object.entries(this.value);
    const filtered = entries.filter(([_, value]) => value !== undefined && value !== null);
    return piper(Object.fromEntries(filtered));
  }
  
  isEmpty() {
    return piper(Object.keys(this.value).length === 0);
  }
  
  length() {
    return piper(Object.keys(this.value).length);
  }
}