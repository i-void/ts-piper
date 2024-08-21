import { Piper } from "./Piper";
import { piper, type PiperType } from "./createPiper";

export class SetPiper<T> extends Piper<Set<T>> {
  toArray() {
    return piper(Array.from(this.value));
  }

  first() {
    return piper(Array.from(this.value)[0]);
  }

  last() {
    const arr = Array.from(this.value);
    return piper(arr[arr.length - 1]);
  }

  map<U>(fn: (value: T, index: number) => U) {
    return piper(new Set(Array.from(this.value).map(fn)));
  }
  
  async mapAwait<U>(fn: (value: T, index: number) => Promise<U>) {
    let result: U[] = [];
    let i = 0;
    for (const value of this.value) {
      result.push(await fn(value, i));
      i++;
    }
    return piper(new Set(result));
  }

  async mapAwaitAll<U>(fn: (value: T, index: number) => Promise<U>) {
    return piper(new Set(await Promise.all(Array.from(this.value).map(fn))));
  }
  
  flatMap<U>(fn: (value: T) => U[]) {
    return piper(new Set(Array.from(this.value).flatMap(fn)));
  }

  async flatMapAwaitAll<U>(fn: (value: T) => Promise<U[]>) {
    return piper(new Set((await Promise.all(Array.from(this.value).map(fn))).flat()));
  }

  async flatMapAwait<U>(fn: (value: T) => Promise<U[]>) {
    let result: U[] = [];
    let i = 0;
    for (const value of this.value) {
      result.push(...await fn(value));
      i++;
    }
    return piper(new Set(result.flat()));
  }
  
  filter(fn: (value: T) => boolean) {
    return piper(new Set(Array.from(this.value).filter(fn)));
  }

  reject(fn: (value: T) => boolean) {
    return piper(new Set(Array.from(this.value).filter(v => !fn(v))));
  }
  
  reduce<U>(initialValue: U, fn: (acc: U, value: T, index: number) => U) {
    return piper(Array.from(this.value).reduce(fn, initialValue));
  }

  async reduceAwait<U>(initialValue: U, fn: (acc: U, value: T, index: number) => Promise<U>) {
    let acc = initialValue;
    let i = 0;
    for (const value of this.value) {
      acc = await fn(acc, value, i);
      i++;
    }
    return piper(acc);
  }
  
  delete(value: T) {
    const arr = Array.from(this.value);
    arr.splice(arr.indexOf(value), 1);
    return piper(new Set(arr));
  }
  
  push(value: T) {
    const arr = [...this.value, value]; 
    return piper(new Set(arr));
  }
  
  pop() {
    const arr = Array.from(this.value);
    arr.pop();
    return piper(new Set(arr));
  }
  
  shift() {
    const arr = Array.from(this.value);
    arr.shift();
    return piper(new Set(arr));
  }

  unshift(value: T) {
    const arr = Array.from(this.value);
    arr.unshift(value);
    return piper(new Set(arr));
  }

  any(fn: (value: T) => boolean) {
    return piper(Array.from(this.value).some(fn));
  }

  all(fn: (value: T) => boolean) {
    return piper(Array.from(this.value).every(fn));
  }

  none(fn: (value: T) => boolean) {
    return piper(!Array.from(this.value).some(fn));
  }

  take(count: number) {
    return piper(new Set(Array.from(this.value).slice(0, count)));
  }

  takeLast(count: number) {
    return piper(new Set(Array.from(this.value).slice(-count)));
  }

  takeWhile(fn: (value: T) => boolean) {
    return piper(new Set(Array.from(this.value).filter(fn)));
  }
  
  skip(count: number) {
    return piper(new Set(Array.from(this.value).slice(count)));
  }

  skipWhile(fn: (value: T) => boolean) {
    let result = [];
    let skip = true;
    for (const value of this.value) {
      if (skip && fn(value)) {
        continue;
      }
      skip = false;
      result.push(value);
    }
    return piper(new Set(result));
  }
  
  reverse() {
    return piper(new Set(Array.from(this.value).reverse()));
  }

  sort(compareFn?: (a: T, b: T) => number) {
    return piper(new Set(Array.from(this.value).sort(compareFn)));
  }

  sortBy(fn: (value: T) => any) {
    return piper(new Set(Array.from(this.value).sort((a, b) => {
      if (fn(a) < fn(b)) return -1;
      if (fn(a) > fn(b)) return 1;
      return 0;
    })));
  }

  sortDesc(compareFn?: (a: T, b: T) => number) {
    return piper(new Set(Array.from(this.value).sort(compareFn).reverse()));
  }

  sortByDesc(fn: (value: T) => any) {
    return piper(new Set(Array.from(this.value).sort((a, b) => {
      if (fn(a) < fn(b)) return 1;
      if (fn(a) > fn(b)) return -1;
      return 0;
    })));
  }

  forEach(fn: (value: T, index: number) => any) {
    let i = 0;
    for (const value of this.value) {
      fn(value, i);
      i++;
    }
  }

  async forEachAwait(fn: (value: T, index: number) => Promise<any>) {
    let i = 0;
    for (const value of this.value) {
      await fn(value, i);
      i++;
    }
  }
  
  includes(value: T) {
    return piper(this.value.has(value));
  }
  
  compact() {
    return piper(new Set(Array.from(this.value).filter(v => v !== undefined && v !== null)));
  }

  isEmpty() {
    return piper(this.value.size === 0);
  }
  
  nth(index: number) {
    return piper(Array.from(this.value)[index]);
  }
  
  length() {
    return piper(this.value.size);
  }

  groupBy<K>(fn: (value: T) => K) {
    const result = new Map<K, T[]>();
    for (const value of this.value) {
      const key = fn(value);
      if (!result.has(key)) {
        result.set(key, []);
      }
      result.get(key)!.push(value);
    }
    return piper(result);
  }

  [index: number]: PiperType<T>;
}

export class NumberSetPiper extends SetPiper<number> {
  min() {
    return piper(Math.min(...Array.from(this.value)));
  }

  max() {
    return piper(Math.max(...Array.from(this.value)));
  }
}

export class StringSetPiper extends SetPiper<string> {
  join(separator: string) {
    return piper(Array.from(this.value).join(separator));
  }
}