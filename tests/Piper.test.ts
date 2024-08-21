import { describe, it, expect } from "bun:test"
import { piper } from "../src/createPiper";

describe("Piper", () => {
  it("do", () => {
    expect(piper(5).do(x => x + 1).value).toBe(6);
  })
})