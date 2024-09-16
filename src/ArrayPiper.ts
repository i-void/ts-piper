import { Piper } from "./Piper";
import { piper, type PiperType } from "./createPiper";

export class ArrayPiper<T> extends Piper<Array<T>> {
  toRecord<U>(): PiperType<Record<string, U>> {
    if (this.value.length === 0) {
      return piper({}) as any;
    }
    return piper(Object.fromEntries(this.value as [string, U][]));
  }

  first() {
    const firstVal = this.value[0];
    return piper(firstVal as T | undefined);
  }

  last() {
    return piper(this.value[this.value.length - 1] as T | undefined);
  }

  map<U>(fn: (value: T, index: number) => U) {
    return piper(this.value.map(fn));
  }

  async mapAwait<U>(fn: (value: T, index: number) => Promise<U>) {
    let result: U[] = [];
    for (let i = 0; i < this.value.length; i++) {
      result.push(await fn(this.value[i], i));
    }
    return piper(result);
  }
  
  async mapAwaitAll<U>(fn: (value: T, index: number) => Promise<U>) {
    return piper(await Promise.all(this.value.map(fn)));
  }

  mapWhen<U>(condFn: (value: T, index: number) => boolean, fn: (value: T, index: number) => U) {
    let result: U[] = [];
    for (let i = 0; i < this.value.length; i++) {
      if (condFn(this.value[i], i)) {
        result.push(fn(this.value[i], i));
      }
    }
    return piper(result);
  }
  
  async mapWhenAwait<U>(condFn: (value: T, index: number) => boolean, fn: (value: T, index: number) => Promise<U>) {
    let result: U[] = [];
    for (let i = 0; i < this.value.length; i++) {
      if (condFn(this.value[i], i)) {
        result.push(await fn(this.value[i], i));
      }
    }
    return piper(result);
  }
  
  mapIf<U>(condFn: (value: T, index: number) => boolean, fn: (value: T, index: number) => U) {
    let result: U[] = [];
    for (let i = 0; i < this.value.length; i++) {
      if (condFn(this.value[i], i)) {
        result.push(fn(this.value[i], i));
      } else {
        result.push(this.value[i] as any);
      }
    }
    return piper(result);
  }
  
  async mapIfAwait<U>(condFn: (value: T, index: number) => boolean, fn: (value: T, index: number) => Promise<U>) {
    let result: U[] = [];
    for (let i = 0; i < this.value.length; i++) {
      if (condFn(this.value[i], i)) {
        result.push(await fn(this.value[i], i));
      } else {
        result.push(this.value[i] as any);
      }
    }
    return piper(result);
  }
  
  flatMap<U>(fn: (value: T) => U[]) {
    return piper(this.value.flatMap(fn));
  }
  
  async flatMapAwaitAll<U>(fn: (value: T) => Promise<U[]>) {
    return piper((await Promise.all(this.value.map(fn))).flat());
  }
  
  async flatMapAwait<U>(fn: (value: T) => Promise<U[]>) {
    let result: U[] = [];
    for (let i = 0; i < this.value.length; i++) {
      result.push(...await fn(this.value[i]));
    }
    return piper(result.flat());
  }

  filter(fn: (value: T) => boolean) {
    return piper(this.value.filter(fn));
  }
  
  reject(fn: (value: T) => boolean) {
    return piper(this.value.filter(v => !fn(v)));
  }
  
  reduce<U>(initialValue: U, fn: (acc: U, value: T, index: number) => U) {
    return piper(this.value.reduce(fn, initialValue));
  }
  
  async reduceAwait<U>(initialValue: U, fn: (acc: U, value: T, index: number) => Promise<U>) {
    let acc = initialValue;
    for (let i = 0; i < this.value.length; i++) {
      acc = await fn(acc, this.value[i], i);
    }
    return piper(acc);
  }

  deleteAt(index: number) {
    return piper(this.value.toSpliced(index, 1));
  }

  delete(value: T) {
    const index = this.value.indexOf(value);
    if (index !== -1) {
      return this.deleteAt(index);
    }
    return this;
  }

  deleteAll(value: T) {
    return piper(this.value.filter(v => v !== value));
  }

  push(value: T) {
    return piper(this.value.concat(value));
  }

  pop() {
    return piper(this.value.toSpliced(this.value.length - 1, 1));
  }

  shift() {
    return piper(this.value.toSpliced(0, 1));
  }

  unshift(value: T) {
    return piper([value].concat(this.value));
  }
  
  any(fn: (value: T) => boolean) {
    return piper(this.value.some(fn));
  }

  all(fn: (value: T) => boolean) {
    return piper(this.value.every(fn));
  }

  none(fn: (value: T) => boolean) {
    return piper(!this.value.some(fn));
  }
  
  take(count: number) {
    return piper(this.value.slice(0, count));
  }

  takeLast(count: number) {
    return piper(this.value.slice(this.value.length - count));
  }
  
  takeWhile(fn: (value: T) => boolean) {
    let result = [];
    for (let i = 0; i < this.value.length; i++) {
      if (fn(this.value[i])) {
        result.push(this.value[i]);
      } else {
        break;
      }
    }
    return piper(result);
  }

  skip(count: number) {
    return piper(this.value.slice(count));
  }
  
  skipWhile(fn: (value: T) => boolean) {
    let result = [];
    let skipping = true;
    for (let i = 0; i < this.value.length; i++) {
      if (skipping && fn(this.value[i])) {
        continue;
      } else {
        skipping = false;
        result.push(this.value[i]);
      }
    }
    return piper(result);
  }

  reverse() {
    return piper(this.value.reverse());
  }

  sortBy(fn: (value: T) => any) {
    return piper(this.value.sort((a, b) => {
      const aVal = fn(a);
      const bVal = fn(b);
      if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      } else {
        return 0;
      }
    }));
  }
  
  sort() {
    return piper(this.value.sort());
  }
  
  sortDesc() {
    return piper(this.value.sort((a, b) => {
      if (a < b) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    }));
  }

  sortByDesc(fn: (value: T) => any) {
    return piper(this.value.sort((a, b) => {
      const aVal = fn(a);
      const bVal = fn(b);
      if (aVal < bVal) {
        return 1;
      } else if (aVal > bVal) {
        return -1;
      } else {
        return 0;
      }
    }));
  }
  
  async forEachAwait(fn: (value: T, index: number) => Promise<any>) {
    for (let i = 0; i < this.value.length; i++) {
      await fn(this.value[i], i);
    }
  }

  forEach(fn: (value: T, index: number) => any) {
    for (let i = 0; i < this.value.length; i++) {
      fn(this.value[i], i);
    }
  }
  
  unique() {
    return piper([...new Set(this.value)]);
  }

  uniqueBy(fn: (value: T) => any) {
    return piper(this.value.filter((value, index, self) => self.findIndex(v => fn(v) === fn(value)) === index));
  }
  
  includes(value: T) {
    return piper(this.value.includes(value));
  }

  compact() {
    return piper(this.value.filter(x => x !== undefined && x !== null));
  }
  
  isEmpty() {
    return piper(this.value.length === 0);
  }
  
  zip<U>(other: U[]) {
    return piper(this.value.map((value, index) => [value, other[index]] as const));
  }
  
  zip3<U, V>(other: U[], other2: V[]) {
    return piper(this.value.map((value, index) => [value, other[index], other2[index]] as const));
  }
  
  nth(index: number) {
    return piper(this.value[index]);
  }
  
  flatten(depth: number = 1) {
    return piper(this.value.flat(depth));
  }
  
  length() {
    return piper(this.value.length);
  }
  
  groupBy<U>(fn: (value: T) => U) {
    return piper(this.value.reduce((acc, value) => {
      const key = fn(value);
      if (!acc.get(key)) {
        acc.set(key, []);
      }
      acc.get(key)!.push(value);
      return acc;
    }, new Map<U, T[]>()));
  }
  
  async groupByAwait<U>(fn: (value: T) => Promise<U>) {
    let acc = new Map<U, T[]>();
    for (let i = 0; i < this.value.length; i++) {
      const key = await fn(this.value[i]);
      if (!acc.get(key)) {
        acc.set(key, []);
      }
      acc.get(key)!.push(this.value[i]);
    }
    return piper(acc);
  }
  
  async groupByAwaitAll<U>(fn: (value: T) => Promise<U>) {
    let results = await Promise.all(this.value.map(fn));
    let acc = new Map<U, T[]>();
    for (let i = 0; i < results.length; i++) {
      const key = results[i];
      if (!acc.get(key)) {
        acc.set(key, []);
      }
      acc.get(key)!.push(this.value[i]);
    }
    return piper(acc);
  }

  find(fn: (value: T) => boolean) {
    return piper(this.value.find(fn));
  }

  async findAwait(fn: (value: T) => Promise<boolean>) {
    for (let i = 0; i < this.value.length; i++) {
      if (await fn(this.value[i])) {
        return piper(this.value[i]);
      }
    }
    return piper(undefined);
  }
  
  minBy(fn: (value: T) => any): PiperType<T> | PiperType<undefined> {
    if (this.value.length === 0) {
      return piper(undefined);
    }
    let min = this.value[0];
    for (let i = 1; i < this.value.length; i++) {
      if (fn(this.value[i]) < fn(min)) {
        min = this.value[i];
      }
    }
    return piper(min);
  }

  maxBy(fn: (value: T) => any): PiperType<T> | PiperType<undefined> {
    if (this.value.length === 0) {
      return piper(undefined);
    }
    let max = this.value[0];
    for (let i = 1; i < this.value.length; i++) {
      if (fn(this.value[i]) > fn(max)) {
        max = this.value[i];
      }
    }
    return piper(max);
  }
    
  
  [index: number]: PiperType<T>;
}

export class StringArrayPiper extends ArrayPiper<string> {
  join(seperator: string = '') {
    return piper(this.value.join(seperator));
  }
}

export class NumberArrayPiper extends ArrayPiper<number> {
  sum() {
    return piper(this.value.reduce((acc, value) => acc + value, 0));
  }
  
  average() {
    return piper(this.value.reduce((acc, value) => acc + value, 0) / this.value.length);
  }
  
  min() {
    return piper(Math.min(...this.value));
  }
  
  max() {
    return piper(Math.max(...this.value));
  }
}