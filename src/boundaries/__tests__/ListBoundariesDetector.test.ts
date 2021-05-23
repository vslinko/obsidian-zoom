import { IEditor, ListBoundariesDetector } from "../ListBoundariesDetector";

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

- 3
  - 4
- 5

- 7

  - 9

- 11

13

- 15
  16

  - 18
- 19

- 21
  - 22
    23
  24

- 26
`);

describe("ListBoundariesDetector#detect", () => {
  test("should detect list with sublists", () => {
    const d = new ListBoundariesDetector(editor, 3);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 3,
      endLine: 5,
    });
  });

  test("should not detect on empty line with no list before", () => {
    const d = new ListBoundariesDetector(editor, 2);

    const result = d.detect();

    expect(result).toBeNull();
  });

  test("should detect on empty line with list before", () => {
    const d = new ListBoundariesDetector(editor, 6);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 5,
      endLine: 7,
    });
  });

  test("should detect list with notes and sublists", () => {
    const d = new ListBoundariesDetector(editor, 17);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 15,
      endLine: 19,
    });
  });

  test("should stop if indent doesn't match", () => {
    const d = new ListBoundariesDetector(editor, 22);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 22,
      endLine: 24,
    });
  });

  test("should detect last list", () => {
    const d = new ListBoundariesDetector(editor, 26);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 26,
      endLine: 28,
    });
  });
});
