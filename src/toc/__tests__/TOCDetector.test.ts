import { TOCDetector, IEditor } from "../TOCDetector";

function makeEditor(text: string): IEditor {
  const lines = text.split("\n");

  return {
    getLine: (n) => lines[n],
    firstLine: () => 0,
    lastLine: () => lines.length - 1,
  };
}

const editor = makeEditor(`
# 1

## 3

- 5
  1. 6
    - 7
  2. 8
    - 9
`);

describe("TOCDetector#detect", () => {
  test("should detect heading with subheadings", () => {
    const d = new TOCDetector(editor, 9);

    const result = d.detect();

    expect(result).toStrictEqual([
      { line: 1, text: "1" },
      { line: 3, text: "3" },
      { line: 5, text: "5" },
      { line: 8, text: "8" },
      { line: 9, text: "9" },
    ]);
  });
});
