import { describe, it, expect } from "bun:test"
import { piper } from "../src/createPiper";

describe("Boolean", () => {
  it("doWhen", () => {
    const result = piper(true).doWhen(() => "true", () => "false").value;
    expect(result).toBe("true");
  })
})