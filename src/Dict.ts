export class Dict<K, V> {
  entries: [K, V][];

  static from<K extends string|number|symbol, V>(record: Record<K, V>) {
    return new Dict(Object.entries(record)) as Dict<K, V>;
  }
  
  static fromEntries<K, V>(entries: [K, V][]) {
    return new Dict(entries);
  }
  
  static fromMap<K, V>(map: Map<K, V>) {
    return new Dict(Array.from(map.entries()));
  }

  constructor(entries: [K, V][]) {
    this.entries = entries;
  }
  
  toRecord(): Record<string, V> {
    return Object.fromEntries(this.entries);
  }

  toMap() {
    return new Map(this.entries);
  }
  
  toJSON(indent?: number) {
    return JSON.stringify(this.toRecord(), null, indent);
  }

  map<U>(fn: (record: { key: K, value: V }, index: number) => U) {
    return this.entries.map(([key, value], index) => fn({ key, value }, index));
  }

  async mapAsync<U>(fn: (record: { key: K, value: V }, index: number) => Promise<U>) {
    let result: U[] = [];
    for (let i = 0; i < this.entries.length; i++) {
      result.push(await fn({ key: this.entries[i][0], value: this.entries[i][1] }, i));
    }
    return result;
  }

  async mapAsyncAll<U>(fn: (record: { key: K, value: V }, index: number) => Promise<U>) {
    return Promise.all(this.map(fn));
  }
  
  mapValues<U>(fn: (record: { key: K, value: V }, index: number) => U) {
    const mapped = this.map(({ key, value}, i) => {
      return [key, fn({ key, value }, i)] as [K, U];
    })
    return new Dict(mapped);
  }

  async mapValuesAsync<U>(fn: (record: { key: K, value: V }, index: number) => Promise<U>) {
    const mapped = await this.mapAsync(async ({ key, value}, i) => {
      return [key, await fn({ key, value }, i)] as [K, U];
    })
    return new Dict(mapped);
  }

  async mapValuesAsyncAll<U>(fn: (record: { key: K, value: V }, index: number) => Promise<U>) {
    const mapped = await this.mapAsync(async ({ key, value}, i) => {
      return [key, await fn({ key, value }, i)] as [K, U];
    })
    return new Dict(mapped);
  }

  mapKeys<U>(fn: (record: { key: K, value: V }, index: number) => U) {
    const mapped = this.map(({ key, value}, i) => {
      return [fn({ key, value }, i), value] as [U, V];
    })
    return new Dict(mapped);
  }

  async mapKeysAsync<U>(fn: (record: { key: K, value: V }, index: number) => Promise<U>) {
    const mapped = await this.mapAsync(async ({ key, value}, i) => {
      return [await fn({ key, value }, i), value] as [U, V];
    })
    return new Dict(mapped);
  }

  async mapKeysAsyncAll<U>(fn: (record: { key: K, value: V }, index: number) => Promise<U>) {
    const mapped = await this.mapAsyncAll(async ({ key, value}, i) => {
      return [await fn({ key, value }, i), value] as [U, V];
    })
    return new Dict(mapped);
  }

  first() {
    const found = this.entries[0];
    if (!found) {
      return undefined;
    }
    return new Dict(Array(found));
  }

  last() {
    const found = this.entries[this.entries.length - 1];
    if (!found) {
      return undefined;
    }
    return new Dict(Array(found));
  }

  select(fn: (record: { key: K, value: V }, index: number) => boolean) {
    return new Dict(this.entries.filter(([key, value], index) => fn({ key, value }, index)));
  }

  async selectAsync(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    const filtered: [K,V][] = []
    for (let i = 0; i < this.entries.length; i++) {
      if (await fn({ key: this.entries[i][0], value: this.entries[i][1] }, i)) {
        filtered.push(this.entries[i]);
      }
    }
    return new Dict(filtered);
  }

  async selectAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    const functions = this.map((record, i) => fn(record, i));
    const results = await Promise.all(functions);
    const filtered: [K,V][] = []
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        filtered.push(this.entries[i]);
      }
    }
    return new Dict(filtered);
  }
  
  find(fn: (record: { key: K, value: V }, index: number) => boolean) {
    const found = this.entries.find(([key, value], index) => fn({ key, value }, index));
    if (!found) {
      return undefined
    }
    return new Dict(Array(found));
  }
  
  async findAsync(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    for (let i = 0; i < this.entries.length; i++) {
      if (await fn({ key: this.entries[i][0], value: this.entries[i][1] }, i)) {
        return new Dict(Array(this.entries[i]));
      }
    }
    return undefined;
  }

  async findAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    const functions = this.map((record, i) => fn(record, i));
    const results = await Promise.all(functions);
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        return new Dict(Array(this.entries[i]));
      }
    }
    return undefined;
  }

  sortBy(fn: (a: { key: K, value: V }, b: { key: K, value: V }) => number) {
    return new Dict(this.entries.sort(([aKey, aValue], [bKey, bValue]) => fn({ key: aKey, value: aValue }, { key: bKey, value: bValue })));
  }
  
  sort(options: { desc?: boolean } = {}) {
    return this.sortBy((a, b) => {
      if (a.value < b.value) {
        return options.desc ? 1 : -1;
      }
      if (a.value > b.value) {
        return options.desc ? -1 : 1;
      }
      return 0;
    });
  }

  compact(): Dict<K, NonNullable<V>> {
    return this.select(({ value }) => value !== undefined && value !== null) as Dict<K, NonNullable<V>>; 
  }
  
  isEmpty() {
    return this.entries.length === 0;
  }

  length() {
    return this.entries.length;
  }

  forEach(fn: (record: { key: K, value: V }, index: number) => any) {
    this.entries.forEach(([key, value], index) => fn({ key, value }, index));
  }
  
  async forEachAsync(fn: (record: { key: K, value: V }, index: number) => Promise<any>) {
    for (let i = 0; i < this.entries.length; i++) {
      await fn({ key: this.entries[i][0], value: this.entries[i][1] }, i);
    }
  }

  async forEachAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<any>) {
    const functions = this.map((record, i) => fn(record, i));
    await Promise.all(functions);
  }
  
  any(fn: (record: { key: K, value: V }, index: number) => boolean) {
    return this.entries.some(([key, value], index) => fn({ key, value }, index));
  }

  async anyAsync(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    for (let i = 0; i < this.entries.length; i++) {
      if (await fn({ key: this.entries[i][0], value: this.entries[i][1] }, i)) {
        return true;
      }
    }
    return false;
  }

  async anyAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    const functions = this.map((record, i) => fn(record, i));
    const results = await Promise.all(functions);
    return results.some(result => result);
  }

  all(fn: (record: { key: K, value: V }, index: number) => boolean) {
    return this.entries.every(([key, value], index) => fn({ key, value }, index));
  }

  async allAsync(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    for (let i = 0; i < this.entries.length; i++) {
      if (!await fn({ key: this.entries[i][0], value: this.entries[i][1] }, i)) {
        return false;
      }
    }
    return true;
  }

  async allAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    const functions = this.map((record, i) => fn(record, i));
    const results = await Promise.all(functions);
    return results.every(result => result);
  }

  none(fn: (record: { key: K, value: V }, index: number) => boolean) {
    return !this.any(fn);
  }

  async noneAsync(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    return !(await this.anyAsync(fn));
  }

  async noneAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    return !(await this.anyAsyncAll(fn));
  }

  hasKey(key: K) {
    return this.any(({ key: k }) => k === key);
  }

  hasValue(value: V) {
    return this.any(({ value: v }) => v === value);
  }
  
  has(dict: Dict<K, V>) {
    if (this.entries.length < dict.entries.length) {
      return false;
    }
    return dict.entries.every(([key, value]) => this.hasEntry([key, value]));
  }

  hasEntry(entry: [K, V]) {
    return this.any(({ key, value }) => key === entry[0] && value === entry[1]);
  }

  hasEntries(entries: [K, V][]) {
    return entries.every(entry => this.hasEntry(entry));
  }

  omitKey(key: K) {
    return this.select(({ key: k }) => k !== key);
  }

  omitKeys(keys: K[]) {
    return this.select(({ key }) => !keys.includes(key));
  }

  omitValue(value: V) {
    return this.select(({ value: v }) => v !== value);
  }

  omitValues(values: V[]) {
    return this.select(({ value }) => !values.includes(value));
  }

  omitEntry(entry: [K, V]) {
    return this.select(({ key, value }) => key !== entry[0] || value !== entry[1]);
  }

  omitEntries(entries: [K, V][]) {
    return this.select(({ key, value }) => !entries.some(([k, v]) => k === key && v === value));
  }
  
  omit(dict: Dict<K, V>) {
    return this.omitEntries(dict.entries);
  }

  keys() {
    return this.entries.map(([key, _]) => key);
  }
  
  values() {
    return this.entries.map(([_, value]) => value);
  }

  sum(this: Dict<K, number>) {
    return this.reduce(0, (acc, { value }) => acc + value); 
  }
  
  reduce<U>(initialValue: U, fn: (acc: U, record: { key: K, value: V }, index: number) => U) {
    return this.entries.reduce((acc, [key, value], index) => fn(acc, { key, value }, index), initialValue);
  }

  async reduceAsync<U>(initialValue: U, fn: (acc: U, record: { key: K, value: V }, index: number) => Promise<U>) {
    let acc = initialValue;
    for (let i = 0; i < this.entries.length; i++) {
      acc = await fn(acc, { key: this.entries[i][0], value: this.entries[i][1] }, i);
    }
    return acc;
  }
  
  reject(fn: (record: { key: K, value: V }, index: number) => boolean) {
    return this.select((record, index) => !fn(record, index));
  }
  
  async rejectAsync(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    return this.selectAsync(async (record, index) => !(await fn(record, index)));
  }

  async rejectAsyncAll(fn: (record: { key: K, value: V }, index: number) => Promise<boolean>) {
    return this.selectAsyncAll(async (record, index) => !(await fn(record, index)));
  }

  valuesOf(keys: K[]) {
    return this.select(({ key }) => keys.includes(key)).values();
  }
  
  keysOf(values: V[]) {
    return this.select(({ value }) => values.includes(value)).keys();
  }

  key() {
    const found = this.entries[0];
    if (!found) {
      return undefined;
    }
    if (this.entries.length > 1) {
      throw new Error("More than one key found");
    }
    return found[0];
  }

  value() {
    const found = this.entries[0];
    if (!found) {
      return undefined;
    }
    if (this.entries.length > 1) {
      throw new Error("More than one value found");
    }
    return found[1];
  }
  
  get(key: K) {
    return this.entries.find(([k]) => k === key)?.[1];
  }
  
  set(key: K, value: V) {
    const newEntries = this.entries.map(([k, v]) => (k === key ? [k, value] : [k, v]) as [K, V]);
    return new Dict(newEntries);
  }
  
  
  mapValuesWhen(condFn: (record: { key: K, value: V }, index: number) => boolean, mapFn: (record: { key: K, value: V }, index: number) => V) {
    return this.mapValues((record, index) => (condFn(record, index) ? mapFn(record, index) : record.value));
  }
  
  async mapValuesWhenAsync(condFn: (record: { key: K, value: V }, index: number) => Promise<boolean> | boolean, mapFn: (record: { key: K, value: V }, index: number) => Promise<V> | V) {
    return this.mapValuesAsync(async (record, index) => (await condFn(record, index) ? await mapFn(record, index) : record.value));
  }
  
  async mapValuesWhenAsyncAll(condFn: (record: { key: K, value: V }, index: number) => Promise<boolean> | boolean, mapFn: (record: { key: K, value: V }, index: number) => Promise<V> | V) {
    return this.mapValuesAsyncAll(async (record, index) => (await condFn(record, index) ? await mapFn(record, index) : record.value));
  }
  
  merge(dict: Dict<K, V>) {
    return new Dict([...this.entries, ...dict.entries]);
  }
}