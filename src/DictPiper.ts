import { Piper } from "./Piper";
import { piper, type PiperType } from "./createPiper";
import { Dict } from "./Dict";

export class DictPiper<K, V> extends Piper<Dict<K, V>> {
  toRecord() {
    return piper(this.value.toRecord());
  }

  toMap() {
    return piper(this.value.toMap());
  }

  toJSON(space?: number) {
    return piper(this.value.toJSON(space));
  }

  map<U>(fn: (item: { key: K, value: V }) => U) {
    return piper(this.value.map(fn));
  }

  async mapAsync<U>(fn: (item: { key: K, value: V }) => Promise<U>) {
    return piper(await this.value.mapAsync(fn));
  }

  async mapAsyncAll<U>(fn: (item: { key: K, value: V }) => Promise<U>) {
    return piper(await this.value.mapAsyncAll(fn));
  }

  mapValues<U>(fn: (item: { key: K, value: V }) => U) {
    return piper(this.value.mapValues(fn));
  }
  
  async mapValuesAsync<U>(fn: (item: { key: K, value: V }) => Promise<U>) {
    return piper(await this.value.mapValuesAsync(fn));
  }

  async mapValuesAsyncAll<U>(fn: (item: { key: K, value: V }) => Promise<U>) {
    return piper(await this.value.mapValuesAsyncAll(fn));
  }

  mapKeys<U>(fn: (item: { key: K, value: V }) => U) {
    return piper(this.value.mapKeys(fn));
  }

  async mapKeysAsync<U>(fn: (item: { key: K, value: V }) => Promise<U>) {
    return piper(await this.value.mapKeysAsync(fn));
  }

  async mapKeysAsyncAll<U>(fn: (item: { key: K, value: V }) => Promise<U>) {
    return piper(await this.value.mapKeysAsyncAll(fn));
  }

  first() {
    return piper(this.value.first());
  }

  last() {
    return piper(this.value.last());
  }

  select(fn: (item: { key: K, value: V }) => boolean) {
    return piper(this.value.select(fn));
  }

  async selectAsync(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.selectAsync(fn));
  }

  async selectAsyncAll(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.selectAsyncAll(fn));
  }

  find(fn: (item: { key: K, value: V }) => boolean) {
    return piper(this.value.find(fn));
  }

  async findAsync(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.findAsync(fn));
  }

  async findAsyncAll(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.findAsyncAll(fn));
  }

  sortBy(fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number) {
    return piper(this.value.sortBy(fn));
  }

  sort({ desc = false } = {}) {
    return piper(this.value.sort({ desc }));
  }
  
  compact() {
    return piper(this.value.compact());
  }

  isEmpty() {
    return piper(this.value.isEmpty());
  }

  length() {
    return piper(this.value.length());
  }

  forEach(fn: (item: { key: K, value: V }) => any) {
    this.value.forEach(fn);
    return this;
  }
  
  async forEachAsync(fn: (item: { key: K, value: V }) => Promise<any>) {
    await this.value.forEachAsync(fn);
    return this;
  }

  async forEachAsyncAll(fn: (item: { key: K, value: V }) => Promise<any>) {
    await this.value.forEachAsyncAll(fn);
    return this;
  }

  any(fn: (item: { key: K, value: V }) => boolean) {
    return piper(this.value.any(fn));
  }

  async anyAsync(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.anyAsync(fn));
  }

  async anyAsyncAll(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.anyAsyncAll(fn));
  }

  all(fn: (item: { key: K, value: V }) => boolean) {
    return piper(this.value.all(fn));
  }

  async allAsync(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.allAsync(fn));
  }

  async allAsyncAll(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.allAsyncAll(fn));
  }

  none(fn: (item: { key: K, value: V }) => boolean) {
    return piper(this.value.none(fn));
  }

  async noneAsync(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.noneAsync(fn));
  }

  async noneAsyncAll(fn: (item: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.noneAsyncAll(fn));
  }

  hasKey(key: K) {
    return piper(this.value.hasKey(key));
  }

  hasValue(value: V) {
    return piper(this.value.hasValue(value));
  }

  has(dict: Dict<K, V>) {
    return piper(this.value.has(dict));
  }
  
  hasEntry(entry: [K, V]) {
    return piper(this.value.hasEntry(entry));
  }

  hasEntries(entries: [K, V][]) {
    return piper(this.value.hasEntries(entries));
  }

  omitKey(key: K) {
    return piper(this.value.omitKey(key));
  }

  omitKeys(keys: K[]) {
    return piper(this.value.omitKeys(keys));
  }
  
  omitValue(value: V) {
    return piper(this.value.omitValue(value));
  }

  omitValues(values: V[]) {
    return piper(this.value.omitValues(values));
  }

  omitEntry(entry: [K, V]) {
    return piper(this.value.omitEntry(entry));
  }

  omitEntries(entries: [K, V][]) {
    return piper(this.value.omitEntries(entries));
  }

  omit(dict: Dict<K, V>) {
    return piper(this.value.omit(dict));
  }

  keys() {
    return piper(this.value.keys());
  }

  values() {
    return piper(this.value.values());
  }

  sum(this: DictPiper<string, number>) {
    return piper(this.value.sum());
  }
  
  reduce<U>(initialValue: U, fn: (acc: U, record: { key: K, value: V }, index: number) => U) {
    return piper(this.value.reduce(initialValue, fn));
  }
  
  async reduceAsync<U>(initialValue: U, fn: (acc: U, record: { key: K, value: V }, index: number) => Promise<U>) {
    return piper(await this.value.reduceAsync(initialValue, fn));
  }

  reject(fn: (record: { key: K, value: V }) => boolean) {
    return piper(this.value.reject(fn));
  }

  async rejectAsync(fn: (record: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.rejectAsync(fn));
  }

  async rejectAsyncAll(fn: (record: { key: K, value: V }) => Promise<boolean>) {
    return piper(await this.value.rejectAsyncAll(fn));
  }

  valuesOf(keys: K[]) {
    return piper(this.value.valuesOf(keys));
  }

  keysOf(values: V[]) {
    return piper(this.value.keysOf(values));
  }

  key() {
    return piper(this.value.key());
  }

  val() {
    return piper(this.value.value());
  }
  
  get(key: K) {
    return piper(this.value.get(key));
  }

  set(key: K, value: V) {
    return piper(this.value.set(key, value));
  }

  mapValuesWhen(condition: (record: { key: K, value: V }) => boolean, fn: (record: { key: K, value: V }) => V) {
    return piper(this.value.mapValuesWhen(condition, fn));
  }

  async mapValuesWhenAsync(condition: (record: { key: K, value: V }) => Promise<boolean>, fn: (record: { key: K, value: V }) => Promise<V>) {
    return piper(await this.value.mapValuesWhenAsync(condition, fn));
  }

  async mapValuesWhenAsyncAll(condition: (record: { key: K, value: V }) => Promise<boolean>, fn: (record: { key: K, value: V }) => Promise<V>) {
    return piper(await this.value.mapValuesWhenAsyncAll(condition, fn));
  }
  
  merge(dict: Dict<K, V>) {
    return piper(this.value.merge(dict));
  }
}