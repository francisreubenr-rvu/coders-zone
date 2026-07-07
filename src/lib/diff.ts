// Deterministic classifier for expected-vs-got judge mismatches. Pure string/number
// logic only (no AI call) so it's instant and free to run on every failed test.
// Inputs are expected to already be normalized/trimmed, as judge/route.ts provides them.

function parseIntStrict(s: string): number | null {
  const t = s.trim();
  if (!/^-?\d+$/.test(t)) return null;
  return parseInt(t, 10);
}

function collapseWhitespace(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

/**
 * Classify why `got` doesn't match `expected`, for failing test output.
 * Returns a short human-readable hint, or null if nothing specific was detected
 * (caller falls back to the raw expected/got diff).
 */
export function classifyDiff(expected: string, got: string): string | null {
  if (got.trim() === "") {
    return "No output was produced. Check that your program actually prints something, and that it isn't erroring out silently before reaching a print statement.";
  }

  const expectedLines = expected.split("\n");
  const gotLines = got.split("\n");

  if (expectedLines.length !== gotLines.length) {
    return `Expected ${expectedLines.length} line(s) of output, got ${gotLines.length}. Check your loop bounds or condition — you're producing the wrong number of outputs.`;
  }

  const diffIndices: number[] = [];
  for (let i = 0; i < expectedLines.length; i++) {
    if (expectedLines[i] !== gotLines[i]) diffIndices.push(i);
  }
  if (diffIndices.length === 0) return null;

  const allOffByOne = diffIndices.every((i) => {
    const e = parseIntStrict(expectedLines[i]);
    const g = parseIntStrict(gotLines[i]);
    return e !== null && g !== null && Math.abs(e - g) === 1;
  });
  if (allOffByOne) {
    return "Every mismatched value is off by exactly 1 — classic off-by-one. Check a loop's start/end bound, or a +1/-1 in your calculation.";
  }

  const allWhitespaceEqual = diffIndices.every(
    (i) => collapseWhitespace(expectedLines[i]) === collapseWhitespace(gotLines[i])
  );
  if (allWhitespaceEqual) {
    return "Your values match but spacing differs — check for extra or missing spaces/tabs between outputs.";
  }

  const allCaseEqual = diffIndices.every(
    (i) => expectedLines[i].toLowerCase() === gotLines[i].toLowerCase()
  );
  if (allCaseEqual) {
    return "Matches except for letter casing — check for a stray `.upper()`/`.lower()` or string literal casing.";
  }

  return null;
}
