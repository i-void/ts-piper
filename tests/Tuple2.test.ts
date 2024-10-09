import { describe, it, expect } from "bun:test"
import { Dict } from "../src/Dict"
import { Tuple2 } from "../src/Tuple2";

describe("Tuple2", () => {
  it("new", () => {
    expect(Tuple2.new(1, 2).toArray()).toEqual([1, 2]);
  })
  it("from", () => {
    expect(Tuple2.from([1, 2]).toArray()).toEqual([1, 2]);
  })
  it("mapFirst", () => {
    expect(Tuple2.new(1, 2).mapFirst(a => a.toString()).toArray()).toEqual(["1", 2]);
  })
  it("mapSecond", () => {
    expect(Tuple2.new(1, 2).mapSecond(b => b.toString()).toArray()).toEqual([1, "2"]);
  })
  it("map", () => {
    expect(Tuple2.new(1, 2).map((a, b) => [a.toString(), b.toString()]).toArray()).toEqual(["1", "2"]);
  })
  it("setFirst", () => {
    expect(Tuple2.new(1, 2).setFirst("1").toArray()).toEqual(["1", 2]);
  })
  it("setSecond", () => {
    expect(Tuple2.new(1, 2).setSecond("2").toArray()).toEqual([1, "2"]);
  })
  it("first", () => {
    expect(Tuple2.new(1, 2).first()).toEqual(1);
  })
  it("second", () => {
    expect(Tuple2.new(1, 2).second()).toEqual(2);
  })
})
    