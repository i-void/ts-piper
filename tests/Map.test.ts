import { describe, it, expect } from "bun:test"
import { piper } from "../src/createPiper";

describe("Map", () => {
  it("map", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).map(({ value }) => value * 2).value).toEqual([2, 4, 6]);
  })
  it("mapAwait", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapAwait(async ({ value }) => Promise.resolve(value * 2))).value).toEqual([2, 4, 6]);
  })
  it("mapAwaitAll", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapAwaitAll(async ({ value }) => Promise.resolve(value * 2))).value).toEqual([2, 4, 6]);
  })
  it("mapValues", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapValues(({ value }) => value * 2).value).toEqual(new Map([['a', 2], ['b', 4], ['c', 6]]));
  })
  it("mapValuesAwait", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapValuesAwait(async ({ value }) => Promise.resolve(value * 2))).value).toEqual(new Map([['a', 2], ['b', 4], ['c', 6]]));
  })
  it("mapValuesAwaitAll", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapValuesAwaitAll(async ({ value }) => Promise.resolve(value * 2))).value).toEqual(new Map([['a', 2], ['b', 4], ['c', 6]]));
  })
  it("mapKeys", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapKeys(({ key }) => key + key).value).toEqual(new Map([['aa', 1], ['bb', 2], ['cc', 3]]));
  })
  it("mapKeysAwaitAll", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapKeysAwaitAll(async ({ key }) => Promise.resolve(key + key))).value).toEqual(new Map([['aa', 1], ['bb', 2], ['cc', 3]]));
  })
  it("mapKeysAwait", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).mapKeysAwait(async ({ key }) => Promise.resolve(key + key))).value).toEqual(new Map([['aa', 1], ['bb', 2], ['cc', 3]]));
  })
  it("filter", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).filter(({ value }) => value > 1).value).toEqual(new Map([['b', 2], ['c', 3]]));
  })
  it("reject", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).reject(({ value }) => value > 1).value).toEqual(new Map([['a', 1]]));
  })
  it("reduce", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).reduce(0, (acc, { value }) => acc + value).value).toEqual(6);
  })
  it("reduceAwait", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).reduceAwait(0, async (acc, { value }) => Promise.resolve(acc + value))).value).toEqual(6);
  })
  it("omitKeys", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).omitKeys('a', 'b').value).toEqual(new Map([['c', 3]]));
  })
  it("omitValues", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).omitValues(1, 2).value).toEqual(new Map([['c', 3]]));
  })
  it("omitKey", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).omitKey('a').value).toEqual(new Map([['b', 2], ['c', 3]]));
  })
  it("omitValue", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).omitValue(1).value).toEqual(new Map([['b', 2], ['c', 3]]));
  })
  it("omitEntries", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).omitEntries(['a', 1], ['c', 3]).value).toEqual(new Map([['b', 2]]));
  })
  it("omitEntry", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).omitEntry(['a', 1]).value).toEqual(new Map([['b', 2], ['c', 3]]));
  })
  it("keys", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).keys().value).toEqual(['a', 'b', 'c']);
  })
  it("values", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).values().value).toEqual([1, 2, 3]);
  })
  it("entries", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).entries().value).toEqual([['a', 1], ['b', 2], ['c', 3]]);
  })
  it("valuesOf", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).valuesOf('a', 'c').value).toEqual([1, 3]);
  })
  it("valueOf", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).valueOf('a').value).toEqual(1);
  })
  it("any", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).any(({ value }) => value > 2).value).toEqual(true);
  })
  it("all", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).all(({ value }) => value > 0).value).toEqual(true);
  })
  it("none", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).none(({ value }) => value > 3).value).toEqual(true);
  })
  it("hasKey", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).hasKey('a').value).toEqual(true);
  })
  it("hasValue", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).hasValue(1).value).toEqual(true);
  })
  it("forEach", () => {
    let sum = 0;
    piper(new Map([['a', 1], ['b', 2], ['c', 3]])).forEach(({ value }) => sum += value);
    expect(sum).toEqual(6);
  })
  it("forEachAwait", async () => {
    let sum = 0;
    await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).forEachAwait(async ({ value }) => sum += value);
    expect(sum).toEqual(6);
  })
  it("compact", () => {
    expect(piper(new Map([['a', 1], ['b', null], ['c', 3]])).compact().value).toEqual(new Map([['a', 1], ['c', 3]]));
  })
  it("isEmpty", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).isEmpty().value).toEqual(false);
    expect(piper(new Map()).isEmpty().value).toEqual(true);
  })
  it("length", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).length().value).toEqual(3);
  })
  it("find", () => {
    expect(piper(new Map([['a', 1], ['b', 2], ['c', 3]])).find(({ value }) => value > 2).value).toEqual(['c', 3]);
  })
  it("findAwait", async () => {
    expect((await piper(new Map([['a', 1], ['b', 2], ['c', 3]])).findAwait(async ({ value }) => Promise.resolve(value > 2))).value).toEqual(['c', 3]);
  })
})