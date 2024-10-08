import { describe, it, expect } from "bun:test"
import { piper } from "../src/createPiper";

describe("Set", () => {
  it("toArray", () => {
    expect(piper(new Set([1, 2, 3])).toArray().value).toEqual([1, 2, 3]);
  })
  it("first", () => {
    expect(piper(new Set([1, 2, 3])).first().value).toBe(1);
  })
  it("last", () => {
    expect(piper(new Set([1, 2, 3])).last().value).toBe(3);
  })
  it("map", () => {
    expect(piper(new Set([1, 2, 3])).map(x => x * 2).value).toEqual(new Set([2, 4, 6]));
  })
  it("mapAwait", async () => {
    expect((await piper(new Set([1, 2, 3])).mapAwait(async x => Promise.resolve(x * 2))).value).toEqual(new Set([2, 4, 6]));
  })
  it("mapAwaitAll", async () => {
    expect((await piper(new Set([1, 2, 3])).mapAwaitAll(async x => Promise.resolve(x * 2))).value).toEqual(new Set([2, 4, 6]));
  })
  it("flatMap", () => {
    expect(piper(new Set([1, 2, 3])).flatMap(x => [x, x]).value).toEqual(new Set([1, 2, 3]));
  })
  it("flatMapAwaitAll", async () => {
    expect((await piper(new Set([1, 2, 3])).flatMapAwaitAll(async x => Promise.resolve([x, x]))).value).toEqual(new Set([1, 2, 3]));
  })
  it("flatMapAwait", async () => {
    expect((await piper(new Set([1, 2, 3])).flatMapAwait(async x => Promise.resolve([x, x]))).value).toEqual(new Set([1, 2, 3]));
  })
  it("filter", () => {
    expect(piper(new Set([1, 2, 3])).filter(x => x > 1).value).toEqual(new Set([2, 3]));
  })
  it("reject", () => {
    expect(piper(new Set([1, 2, 3])).reject(x => x > 1).value).toEqual(new Set([1]));
  })
  it("reduce", () => {
    expect(piper(new Set([1, 2, 3])).reduce(0, (acc, x) => acc + x).value).toBe(6);
  })
  it("reduceAwait", async () => {
    expect((await piper(new Set([1, 2, 3])).reduceAwait(0, async (acc, x) => Promise.resolve(acc + x))).value).toBe(6);
  })
  it("delete", () => {
    expect(piper(new Set([1, 2, 3])).delete(2).value).toEqual(new Set([1, 3]));
  })
  it("push", () => {
    expect(piper(new Set([1, 2, 3])).push(4).value).toEqual(new Set([1, 2, 3, 4]));
  })
  it("pop", () => {
    expect(piper(new Set([1, 2, 3])).pop().value).toEqual(new Set([1, 2]));
  })
  it("shift", () => {
    expect(piper(new Set([1, 2, 3])).shift().value).toEqual(new Set([2, 3]));
  })
  it("unshift", () => {
    expect(piper(new Set([1, 2, 3])).unshift(0).value).toEqual(new Set([0, 1, 2, 3]));
  })
  it("any", () => {
    expect(piper(new Set([1, 2, 3])).any(x => x === 2).value).toBe(true);
  })
  it("all", () => {
    expect(piper(new Set([1, 2, 3])).all(x => x > 0).value).toBe(true);
  })
  it("none", () => {
    expect(piper(new Set([1, 2, 3])).none(x => x === 4).value).toBe(true);
  })
  it("take", () => {
    expect(piper(new Set([1, 2, 3])).take(2).value).toEqual(new Set([1, 2]));
  })
  it("takeLast", () => {
    expect(piper(new Set([1, 2, 3])).takeLast(2).value).toEqual(new Set([2, 3]));
  })
  it("takeWhile", () => {
    expect(piper(new Set([1, 2, 3])).takeWhile(x => x < 2).value).toEqual(new Set([1]));
  })
  it("skip", () => {
    expect(piper(new Set([1, 2, 3])).skip(2).value).toEqual(new Set([3]));
  })
  it("skipWhile", () => {
    expect(piper(new Set([1, 2, 3])).skipWhile(x => x < 2).value).toEqual(new Set([2, 3]));
  })
  it("reverse", () => {
    expect(piper(new Set([1, 2, 3])).reverse().value).toEqual(new Set([3, 2, 1]));
  })
  it("sort", () => {
    expect(piper(new Set([3, 2, 1])).sort().value).toEqual(new Set([1, 2, 3]));
  })
  it("sortDesc", () => {
    expect(piper(new Set([1, 2, 3])).sortDesc().value).toEqual(new Set([3, 2, 1]));
  })
  it("sortBy", () => {
    expect(piper(new Set([3, 2, 1])).sortBy(x => x).value).toEqual(new Set([1, 2, 3]));
  })
  it("sortByDesc", () => {
    expect(piper(new Set([1, 2, 3])).sortByDesc(x => x).value).toEqual(new Set([3, 2, 1]));
  })
  it("forEach", () => {
    let result = 0;
    piper(new Set([1, 2, 3])).forEach(x => result += x);
    expect(result).toBe(6);
  })
  it("foreachAwait", async () => {
    let result = 0;
    await piper(new Set([1, 2, 3])).forEachAwait(async x => result += x);
    expect(result).toBe(6);
  })
  it("includes", () => {
    expect(piper(new Set([1, 2, 3])).includes(2).value).toBe(true);
  })
  it("compact", () => {
    expect(piper(new Set([1, undefined, 2, null, 3])).compact().value).toEqual(new Set([1, 2, 3]));
  })
  it("isEmpty", () => {
    expect(piper(new Set([])).isEmpty().value).toBe(true);
  })
  it("nth", () => {
    expect(piper(new Set([1, 2, 3])).nth(1).value).toBe(2);
  })
  it("length", () => {
    expect(piper(new Set([1, 2, 3])).length().value).toBe(3);
  })
  it("groupBy", () => {
    expect(piper(new Set([1, 2, 3])).groupBy(x => x % 2).value).toEqual(new Map([[1, [1, 3]], [0, [2]]]));
  })
  it("find", () => {
    expect(piper(new Set([1, 2, 3])).find(x => x > 2).value).toBe(3);
  })
  it("findAwait", async () => {
    expect((await piper(new Set([1, 2, 3])).findAwait(async x => x > 2)).value).toBe(3);
  })
  describe("StringSet", () => {
    it("join", () => {
      expect(piper(new Set(['a', 'b', 'c'])).join(", ").value).toBe("a, b, c");
    })
  })
  describe("NumberSet", () => {
    it("min", () => {
      expect(piper(new Set([1, 2, 3])).min().value).toBe(1);
    })
    it("max", () => {
      expect(piper(new Set([1, 2, 3])).max().value).toBe(3);
    })
  })
})