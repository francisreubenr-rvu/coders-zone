import { describe, expect, it } from "vitest";
import { parseJsonReply } from "./ai";

describe("parseJsonReply", () => {
  it("parses a clean JSON string", () => {
    expect(parseJsonReply('{"a":1,"b":"two"}')).toEqual({ a: 1, b: "two" });
  });

  it("parses JSON wrapped in markdown code fences", () => {
    const text = '```json\n{"a":1,"b":"two"}\n```';
    expect(parseJsonReply(text)).toEqual({ a: 1, b: "two" });
  });

  it("extracts JSON with leading/trailing prose around a {...} block", () => {
    const text = 'Here is the result:\n{"a":1,"b":"two"}\nHope that helps!';
    expect(parseJsonReply(text)).toEqual({ a: 1, b: "two" });
  });

  it("returns null for genuinely malformed input", () => {
    expect(parseJsonReply("not json at all, sorry")).toBeNull();
  });
});
