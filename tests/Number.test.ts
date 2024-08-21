import { describe, it, expect } from "bun:test"
import { piper } from "../src/createPiper";

describe("Number", () => {
  it("range", () => {
    expect(piper(5).range().value).toEqual([0, 1, 2, 3, 4]);
  })
  it("isZero", () => {
    expect(piper(0).isZero().value).toBe(true);
  })
  it("isPositive", () => {
    expect(piper(1).isPositive().value).toBe(true);
  })
  it("isNegative", () => {
    expect(piper(-1).isNegative().value).toBe(true);
  })
})