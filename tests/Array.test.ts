import { describe, it, expect } from "bun:test"
import { piper } from "../src/createPiper";

describe("Array", () => {
  it("first", () => {
    expect(piper([1, 2, 3]).first().value).toBe(1);
  })
  it("last", () => {
    expect(piper([1, 2, 3]).last().value).toBe(3);
  })
  it("map", () => {
    expect(piper([1, 2, 3]).map(x => x * 2).map(i => i).value).toEqual([2, 4, 6]);
  })
  it("mapAwait", async () => {
    expect((await piper([1, 2, 3]).mapAwait(async x => Promise.resolve(x * 2))).value).toEqual([2, 4, 6]);
  })
  it("mapAwaitAll", async () => {
    expect((await piper([1, 2, 3]).mapAwaitAll(async x => Promise.resolve(x * 2))).value).toEqual([2, 4, 6]);
  })
  it("flatMap", () => {
    expect(piper([1, 2, 3]).flatMap(x => [x, x]).value).toEqual([1, 1, 2, 2, 3, 3]);
  })
  it("filter", () => {
    expect(piper([1, 2, 3]).filter(x => x > 1).value).toEqual([2, 3]);
  })
  it("reduce", () => {
    expect(piper([1, 2, 3]).reduce(0, (acc, x) => acc + x).value).toBe(6);
  })
  it("reduceAwait", async () => {
    expect((await piper([1, 2, 3]).reduceAwait(0, async (acc, x) => Promise.resolve(acc + x))).value).toBe(6);
  })
  it("deleteAt", () => {
    expect(piper([1, 2, 3]).deleteAt(1).value).toEqual([1, 3]);
  })
  it("delete", () => {
    expect(piper([1, 2, 3]).delete(2).value).toEqual([1, 3]);
  })
  it("deleteAll", () => {
    expect(piper([1, 2, 3, 2]).deleteAll(2).value).toEqual([1, 3]);
  })
  it("push", () => {
    expect(piper([1, 2, 3]).push(4).value).toEqual([1, 2, 3, 4]);
  })
  it("pop", () => {
    expect(piper([1, 2, 3]).pop().value).toEqual([1, 2]);
  }),
  it("any", () => {
    expect(piper([1, 2, 3]).any(x => x === 2).value).toBe(true);
  })
  it("all", () => {
    expect(piper([1, 2, 3]).all(x => x > 0).value).toBe(true);
  })
  it("none", () => {
    expect(piper([1, 2, 3]).none(x => x === 4).value).toBe(true);
  })
  it("take", () => {
    expect(piper([1, 2, 3]).take(2).value).toEqual([1, 2]);
  })
  it("takeLast", () => {
    expect(piper([1, 2, 3]).takeLast(2).value).toEqual([2, 3]);
  })
  it("skip", () => {
    expect(piper([1, 2, 3]).skip(2).value).toEqual([3]);
  })
  it("reverse", () => {
    expect(piper([1, 2, 3]).reverse().value).toEqual([3, 2, 1]);
  })
  it("takeWhile", () => {
    expect(piper([1, 2, 3]).takeWhile(x => x < 2).value).toEqual([1]);
  })
  it("skipWhile", () => {
    expect(piper([1, 2, 3]).skipWhile(x => x < 2).value).toEqual([2, 3]);
  })
  it("sort", () => {
    expect(piper([3, 2, 1]).sort().value).toEqual([1, 2, 3]);
  })
  it("sortBy", () => {
    expect(piper([3, 2, 1]).sortBy(x => x).value).toEqual([1, 2, 3]);
  })
  it("sortDesc", () => {
    expect(piper([1, 2, 3]).sortDesc().value).toEqual([3, 2, 1]);
  })
  it("sortByDesc", () => {
    expect(piper([1, 2, 3]).sortByDesc(x => x).value).toEqual([3, 2, 1]);
  })
  it("forEach", () => {
    let result = 0;
    piper([1, 2, 3]).forEach(x => result += x);
    expect(result).toBe(6);
  })
  it("foreachAwait", async () => {
    let result = 0;
    await piper([1, 2, 3]).forEachAwait(async x => result += x);
    expect(result).toBe(6);
  })
  it("unique", () => {
    expect(piper([1, 2, 2, 3]).unique().value).toEqual([1, 2, 3]);
  })
  it("uniqueBy", () => {
    expect(piper([1, 2, 2, 3]).uniqueBy(x => x).value).toEqual([1, 2, 3]);
  })
  it("compact", () => {
    expect(piper([1, undefined, 2, null, 3]).compact().value).toEqual([1, 2, 3]);
  })
  it("includes", () => {
    expect(piper([1, 2, 3]).includes(2).value).toBe(true);
  })
  it("isEmpty", () => {
    expect(piper([]).isEmpty().value).toBe(true);
  })
  it("zip", () => {
    expect(piper([1, 2, 3]).zip(['a', 'b', 'c']).value).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  })
  it("zip3", () => {
    expect(piper([1, 2, 3]).zip3(['a', 'b', 'c'], ['x', 'y', 'z']).value).toEqual([[1, 'a', 'x'], [2, 'b', 'y'], [3, 'c', 'z']]);
  })
  it("nth", () => {
    expect(piper([1, 2, 3]).nth(1).value).toBe(2);
  })
  it("flatten", () => {
    expect(piper([1, [2, [3]]]).flatten().value).toEqual([1, 2, [3]]);
    expect(piper([1, [2, [3]]]).flatten(2).value).toEqual([1, 2, 3]);
  })
  it("flatMapAwait", async () => {
    expect((await piper([1, 2, 3]).flatMapAwait(async x => Promise.resolve([x, x]))).value).toEqual([1, 1, 2, 2, 3, 3]);
  })
  it("flatMapAwaitAll", async () => {
    expect((await piper([1, 2, 3]).flatMapAwaitAll(async x => Promise.resolve([x, x]))).value).toEqual([1, 1, 2, 2, 3, 3]);
  })
  it("length", () => {
    expect(piper([1, 2, 3]).length().value).toBe(3);
  })
  it("groupBy", () => {
    expect(piper([1, 2, 3, 4]).groupBy(x => x % 2).value).toEqual(new Map([[0, [2, 4]], [1, [1, 3]]]));
  })
  it("groupByAwait", async () => {
    expect((await piper([1, 2, 3, 4]).groupByAwait(async x => Promise.resolve(x % 2))).value).toEqual(new Map([[0, [2, 4]], [1, [1, 3]]]));
  })
  it("groupByAwaitAll", async () => {
    expect((await piper([1, 2, 3, 4]).groupByAwaitAll(async x => Promise.resolve(x % 2))).value).toEqual(new Map([[0, [2, 4]], [1, [1, 3]]]));
  })
  it("shift", () => {
    expect(piper([1, 2, 3]).shift().value).toEqual([2, 3]);
  })
  it("unshift", () => {
    expect(piper([1, 2, 3]).unshift(0).value).toEqual([0, 1, 2, 3]);
  })
  it("toRecord", () => {
    expect(piper([['a', 1], ['b', 2]]).toRecord<number>().value).toEqual({ a: 1, b: 2 });
  })
  it("mapIf", () => {
    expect(piper([1, 2, 3]).mapIf(x => x > 1, x => x * 2).value).toEqual([1, 4, 6]);
  })
  it("mapIfAwait", async () => {
    expect((await piper([1, 2, 3]).mapIfAwait(x => x > 1, async x => Promise.resolve(x * 2))).value).toEqual([1, 4, 6]);
  })
  it("mapWhen", () => {
    expect(piper([1, 2, 3]).mapWhen(x => x > 1, x => x * 2).value).toEqual([4, 6]);
  })
  it("mapWhenAwait", async () => {
    expect((await piper([1, 2, 3]).mapWhenAwait(x => x > 1, async x => Promise.resolve(x * 2))).value).toEqual([4, 6]);
  })
  it("find", () => {
    expect(piper([1, 2, 3]).find(x => x === 2).value).toBe(2);
    expect(piper([] as number[]).find(x => x === 2).value as undefined).toBe(undefined);
  })
  it("findAwait", async () => {
    expect((await piper([1, 2, 3]).findAwait(async x => Promise.resolve(x === 2))).value).toBe(2);
    expect((await piper([] as number[]).findAwait(async x => Promise.resolve(x === 2))).value as undefined).toBe(undefined);
  })
  it("minBy", () => {
    expect(piper([{a: 1}, {a: 2}, {a: 3}]).minBy(x => x.a).value).toEqual({a: 1});
  })
  it("maxBy", () => {
    expect(piper([{a: 1}, {a: 2}, {a: 3}]).maxBy(x => x.a).value).toEqual({a: 3});
  })
  
  describe("StringArray", () => {
    it("join", () => {
      expect(piper(['a', 'b', 'c']).join(',').value).toBe('a,b,c');
    })
  })
  
  describe("NumberArray", () => {
    it("sum", () => {
      expect(piper([1, 2, 3]).sum().value).toBe(6);
    })
    it("average", () => {
      expect(piper([1, 2, 3]).average().value).toBe(2);
    })
    it("min", () => {
      expect(piper([1, 2, 3]).min().value).toBe(1);
    })
    it("max", () => {
      expect(piper([1, 2, 3]).max().value).toBe(3);
    })
  })
})