import { describe, expect, it } from "vitest";
import { norm } from "./normalize";

describe("norm", () => {
  it("trims trailing whitespace per line", () => {
    expect(norm("hello   \nworld\t\n")).toBe("hello\nworld");
  });

  it("drops trailing blank lines", () => {
    expect(norm("a\nb\n\n\n")).toBe("a\nb");
  });

  it("normalizes \\r\\n to \\n", () => {
    expect(norm("a\r\nb\r\nc")).toBe("a\nb\nc");
  });

  it("normalizes matching multi-line output identically on both sides", () => {
    const expected = "1\nFizz\n2\nFizz\nBuzz\n";
    const got = "1\nFizz  \r\n2\r\nFizz\nBuzz\n\n\n";
    expect(norm(got)).toBe(norm(expected));
  });

  it("keeps genuinely different content different after normalization", () => {
    const expected = "1\n2\n3\n";
    const got = "1\n2\n4\n";
    expect(norm(got)).not.toBe(norm(expected));
  });
});
