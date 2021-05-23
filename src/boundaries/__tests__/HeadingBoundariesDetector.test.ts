import {
  HeadingBoundariesDetector,
  IEditor,
} from "../HeadingBoundariesDetector";

function makeEditor(text: string): IEditor {
  const lines = text.split("\n");

  return {
    getLine: (n) => lines[n],
    lastLine: () => lines.length - 1,
  };
}

const editor = makeEditor(`
# one

qwe

## two

qwe

# three

qwe
`);

describe("HeadingBoundariesDetector#detect", () => {
  test("should detect heading with subheadings", () => {
    const d = new HeadingBoundariesDetector(editor, 1);

    const result = d.detect();

    expect(result).toEqual({
      type: "heading",
      startLine: 1,
      endLine: 9,
    });
  });

  test("should return null if file is empty", () => {
    const d = new HeadingBoundariesDetector(makeEditor(""), 0);

    const result = d.detect();

    expect(result).toBeNull();
  });

  test("should return null if cursor not on heading", () => {
    const d = new HeadingBoundariesDetector(editor, 3);

    const result = d.detect();

    expect(result).toBeNull();
  });

  test("should detect subheading", () => {
    const d = new HeadingBoundariesDetector(editor, 5);

    const result = d.detect();

    expect(result).toEqual({
      type: "heading",
      startLine: 5,
      endLine: 9,
    });
  });

  test("should detect last heading", () => {
    const d = new HeadingBoundariesDetector(editor, 9);

    const result = d.detect();

    expect(result).toEqual({
      type: "heading",
      startLine: 9,
      endLine: 13,
    });
  });
});
