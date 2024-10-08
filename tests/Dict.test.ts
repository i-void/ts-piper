import { describe, it, expect } from "bun:test"
import { Dict } from "../src/Dict"

describe("Dict", () => {
  it("from", () => {
    expect(Dict.from({ a: 1, b: 2 }).entries).toEqual([["a", 1], ["b", 2]]);
    expect(Dict.from({ a: 1, b: 2 })).toEqual(new Dict([["a", 1], ["b", 2]]));
  })
  it("fromEntries", () => {
    expect(Dict.fromEntries([["a", 1], ["b", 2]]).entries).toEqual([["a", 1], ["b", 2]]);
    expect(Dict.fromEntries([["a", 1], ["b", 2]])).toEqual(new Dict([["a", 1], ["b", 2]]));
  })
  it("fromMap", () => {
    const map = new Map([["a", 1], ["b", 2]]);
    expect(Dict.fromMap(map).entries).toEqual([["a", 1], ["b", 2]]);
    expect(Dict.fromMap(map)).toEqual(new Dict([["a", 1], ["b", 2]]));
  })
  it("toRecord", () => {
    expect(new Dict([["a", 1], ["b", 2]]).toRecord()).toEqual({ a: 1, b: 2 });
  })
  it("map", () => {
    expect(Dict.from({ a: 1, b: 2 }).map(({ key, value }) => key + value)).toEqual(["a1", "b2"]);
  })
  it("mapAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapAsync(async ({ key, value }) => key + value)).toEqual(["a1", "b2"]);
  })
  it("mapAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapAsyncAll(async ({ key, value }) => key + value)).toEqual(["a1", "b2"]);
  })
  it("mapValues", () => {
    expect(Dict.from({ a: 1, b: 2 }).mapValues(({ key, value }) => key + value)).toEqual(Dict.from({ a: "a1", b: "b2" }));
  })
  it("mapValuesAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapValuesAsync(async ({ key, value }) => key + value)).toEqual(Dict.from({ a: "a1", b: "b2" }));
  })
  it("mapValuesAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapValuesAsyncAll(async ({ key, value }) => key + value)).toEqual(Dict.from({ a: "a1", b: "b2" }));
  })
  it("mapKeys", () => {
    expect(Dict.from({ a: 1, b: 2 }).mapKeys(({ key, value }) => key + value)).toEqual(Dict.from({ a1: 1, b2: 2 }));
  })
  it("mapKeysAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapKeysAsync(async ({ key, value }) => key + value)).toEqual(Dict.from({ a1: 1, b2: 2 }));
  })
  it("mapKeysAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapKeysAsyncAll(async ({ key, value }) => key + value)).toEqual(Dict.from({ a1: 1, b2: 2 }));
  })
  it("first", () => {
    expect(Dict.from({ a: 1, b: 2 }).first()).toEqual(Dict.from({ a: 1 }));
  })
  it("last", () => {
    expect(Dict.from({ a: 1, b: 2 }).last()).toEqual(Dict.from({ b: 2 }));
  })
  it("select", () => {
    expect(Dict.from({ a: 1, b: 2 }).select(({ key, value }) => key === 'a')).toEqual(Dict.from({ a: 1 }));
  })
  it("selectAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).selectAsync(async ({ key, value }) => key === 'a')).toEqual(Dict.from({ a: 1 }));
  })
  it("selectAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).selectAsyncAll(async ({ key, value }) => key === 'a')).toEqual(Dict.from({ a: 1 }));
  })
  it("find", () => {
    expect(Dict.from({ a: 1, b: 2 }).find(({ key, value }) => key === 'a')).toEqual(Dict.from({ a: 1 }));
  })
  it("findAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).findAsync(async ({ key, value }) => key === 'a')).toEqual(Dict.from({ a: 1 }));
  })
  it("findAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).findAsyncAll(async ({ key, value }) => key === 'a')).toEqual(Dict.from({ a: 1 }));
  })
  it("sort", () => {
    expect(Dict.from({ b: 2, a: 1 }).sort()).toEqual(Dict.from({ a: 1, b: 2 }));
    expect(Dict.from({ b: 1, a: 2 }).sort({ desc: true })).toEqual(Dict.from({ a: 2, b: 1 }));
  })
  it("sortBy", () => {
    expect(Dict.from({ b: 2, a: 1, c: 3 }).sortBy(({ key: key1 }, { key: key2 }) => key1.localeCompare(key2))).toEqual(Dict.from({ a: 1, b: 2, c: 3 })); 
  })
  it("compact", () => {
    expect(Dict.from({ a: 1, b: undefined, c: 2, d: null }).compact()).toEqual(Dict.from({ a: 1, c: 2 }));
  })
  it("isEmpty", () => {
    expect(Dict.from({}).isEmpty()).toBe(true);
  })
  it("length", () => {
    expect(Dict.from({ a: 1, b: 2 }).length()).toBe(2);
  })
  it("forEach", () => {
    let result = 0;
    Dict.from({ a: 1, b: 2 }).forEach(({ key, value }) => result += value);
    expect(result).toBe(3);
  })
  it("forEachAsync", async () => {
    let result = 0;
    await Dict.from({ a: 1, b: 2 }).forEachAsync(async ({ key, value }) => result += value);
    expect(result).toBe(3);
  })
  it("forEachAsyncAll", async () => {
    let result = 0;
    await Dict.from({ a: 1, b: 2 }).forEachAsyncAll(async ({ key, value }) => result += value);
    expect(result).toBe(3);
  })
  it("any", () => {
    expect(Dict.from({ a: 1, b: 2 }).any(({ key, value }) => key === 'a')).toBe(true);
  })
  it("anyAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).anyAsync(async ({ key, value }) => key === 'a')).toBe(true);
  })
  it("anyAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).anyAsyncAll(async ({ key, value }) => key === 'a')).toBe(true);
  })
  it("all", () => {
    expect(Dict.from({ a: 1, b: 2 }).all(({ key, value }) => key === 'a')).toBe(false);
  })
  it("allAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).allAsync(async ({ key, value }) => key === 'a')).toBe(false);
  })
  it("allAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).allAsyncAll(async ({ key, value }) => key === 'a')).toBe(false);
  })
  it("none", () => {
    expect(Dict.from({ a: 1, b: 2 }).none(({ key, value }) => key === 'a')).toBe(false);
  })
  it("noneAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).noneAsync(async ({ key, value }) => key === 'a')).toBe(false);
  })
  it("noneAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).noneAsyncAll(async ({ key, value }) => key === 'a')).toBe(false);
  })
  it("hasKey", () => {
    expect(Dict.from({ a: 1, b: 2 }).hasKey("a")).toBe(true);
  })
  it("hasValue", () => {
    expect(Dict.from({ a: 1, b: 2 }).hasValue(1)).toBe(true);
  })
  it("hasEntry", () => {
    expect(Dict.from({ a: 1, b: 2 }).hasEntry(["a", 1])).toBe(true);
  })
  it("hasEntries", () => {
    expect(Dict.from({ a: 1, b: 2 }).hasEntries([["a", 1], ["b", 2]])).toBe(true);
  })
  it("has", () => {
    expect(Dict.from({ a: 1, b: 2, c: 3 }).has(Dict.from({ b: 2, c: 3 }))).toBe(true);
    expect(Dict.from({ a: 1, b: 2 }).has(Dict.from({}))).toBe(true);
  })
  it("omitKey", () => {
    expect(Dict.from({ a: 1, b: 2 }).omitKey("a")).toEqual(Dict.from({ b: 2 }));
  })
  it("omitKeys", () => {
    expect(Dict.from({ a: 1, b: 2, c: 3 }).omitKeys(["a", "b"])).toEqual(Dict.from({ c: 3 }));
  })
  it("omitValue", () => {
    expect(Dict.from({ a: 1, b: 2 }).omitValue(1)).toEqual(Dict.from({ b: 2 }));
  })
  it("omitValues", () => {
    expect(Dict.from({ a: 1, b: 2, c: 3 }).omitValues([1, 2])).toEqual(Dict.from({ c: 3 }));
  })
  it("omitEntry", () => {
    expect(Dict.from({ a: 1, b: 2 }).omitEntry(["a", 1])).toEqual(Dict.from({ b: 2 }));
  })
  it("omitEntries", () => {
    expect(Dict.from({ a: 1, b: 2, c: 3 }).omitEntries([["a", 1], ["b", 2]])).toEqual(Dict.from({ c: 3 }));
  })
  it("omit", () => {
    expect(Dict.from({ a: 1, b: 2, c: 3 }).omit(Dict.from({ a: 1, b: 2 }))).toEqual(Dict.from({ c: 3 }));
  })
  it("keys", () => {
    expect(Dict.from({ a: 1, b: 2 }).keys()).toEqual(["a", "b"]);
  })
  it("values", () => {
    expect(Dict.from({ a: 1, b: 2 }).values()).toEqual([1, 2]);
  })
  it("sum", () => {
    expect(Dict.from({ a: 1, b: 2 }).sum()).toBe(3);
  })
  it("reduce", () => {
    expect(Dict.from({ a: 1, b: 2 }).reduce(0, (acc, { key, value }) => acc + value)).toBe(3);
  })
  it("reduceAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).reduceAsync(0, async (acc, { key, value }) => acc + value)).toBe(3);
  })
  it("reject", () => {
    expect(Dict.from({ a: 1, b: 2 }).reject(({ key, value }) => key === 'a')).toEqual(Dict.from({ b: 2 }));
  })
  it("rejectAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).rejectAsync(async ({ key, value }) => key === 'a')).toEqual(Dict.from({ b: 2 }));
  })
  it("rejectAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).rejectAsyncAll(async ({ key, value }) => key === 'a')).toEqual(Dict.from({ b: 2 }));
  })
  it("valuesOf", () => {
    expect(Dict.from({ a: 1, b: 2 }).valuesOf(["a"])).toEqual([1]);
  })
  it("keysOf", () => {
    expect(Dict.from({ a: 1, b: 2 }).keysOf([1])).toEqual(["a"]);
  })
  it("key", () => {
    expect(Dict.from({ a: 1 }).key()).toBe("a");
  })
  it("value", () => {
    expect(Dict.from({ a: 1 }).value()).toBe(1);
  })
  it("get", () => {
    expect(Dict.from({ a: 1, b: 2 }).get("a")).toBe(1);
  }),
  it("set", () => {
    expect(Dict.from({ a: 1, b: 2 }).set("a", 3)).toEqual(Dict.from({ a: 3, b: 2 }));
  })
  it("toMap", () => {
    expect(Dict.from({ a: 1, b: 2 }).toMap()).toEqual(new Map([["a", 1], ["b", 2]]));
  })
  it("mapValuesWhen", () => {
    expect(Dict.from({ a: 1, b: 2 }).mapValuesWhen(({ key, value }) => key === 'a', ({ key, value }) => value + 1)).toEqual(Dict.from({ a: 2, b: 2 }));
  })
  it("mapValuesWhenAsync", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapValuesWhenAsync(({ key, value }) => key === 'a', async ({ key, value }) => value + 1)).toEqual(Dict.from({ a: 2, b: 2 }));
  })
  it("mapValuesWhenAsyncAll", async () => {
    expect(await Dict.from({ a: 1, b: 2 }).mapValuesWhenAsyncAll(({ key, value }) => key === 'a', async ({ key, value }) => value + 1)).toEqual(Dict.from({ a: 2, b: 2 }));
  })
  it("toJSON", () => {
    expect(Dict.from({ a: 1, b: 2 }).toJSON()).toBe('{"a":1,"b":2}');
    expect(Dict.from({ a: 1, b: 2 }).toJSON(2)).toBe('{\n  "a": 1,\n  "b": 2\n}');
  })
  it("merge", () => {
    expect(Dict.from<string, number>({ a: 1, b: 2 }).merge(Dict.from({ c: 3 }))).toEqual(Dict.from({ a: 1, b: 2, c: 3 }));
  })
})