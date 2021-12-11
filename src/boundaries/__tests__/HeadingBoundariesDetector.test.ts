import { HeadingBoundariesDetector } from "../HeadingBoundariesDetector";

/*`
# one

qwe

## two

qwe

# three

qwe
`*/
const cache = {
  headings: [
    {
      position: {
        start: {
          line: 1,
          col: 0,
          offset: 1,
        },
        end: {
          line: 1,
          col: 5,
          offset: 6,
        },
      },
      heading: "one",
      level: 1,
    },
    {
      position: {
        start: {
          line: 5,
          col: 0,
          offset: 13,
        },
        end: {
          line: 5,
          col: 6,
          offset: 19,
        },
      },
      heading: "two",
      level: 2,
    },
    {
      position: {
        start: {
          line: 9,
          col: 0,
          offset: 26,
        },
        end: {
          line: 9,
          col: 7,
          offset: 33,
        },
      },
      heading: "three",
      level: 1,
    },
  ],
  sections: [
    {
      type: "heading",
      position: {
        start: {
          line: 1,
          col: 0,
          offset: 1,
        },
        end: {
          line: 1,
          col: 5,
          offset: 6,
        },
      },
    },
    {
      type: "paragraph",
      position: {
        start: {
          line: 3,
          col: 0,
          offset: 8,
        },
        end: {
          line: 3,
          col: 3,
          offset: 11,
        },
      },
    },
    {
      type: "heading",
      position: {
        start: {
          line: 5,
          col: 0,
          offset: 13,
        },
        end: {
          line: 5,
          col: 6,
          offset: 19,
        },
      },
    },
    {
      type: "paragraph",
      position: {
        start: {
          line: 7,
          col: 0,
          offset: 21,
        },
        end: {
          line: 7,
          col: 3,
          offset: 24,
        },
      },
    },
    {
      type: "heading",
      position: {
        start: {
          line: 9,
          col: 0,
          offset: 26,
        },
        end: {
          line: 9,
          col: 7,
          offset: 33,
        },
      },
    },
    {
      type: "paragraph",
      position: {
        start: {
          line: 11,
          col: 0,
          offset: 35,
        },
        end: {
          line: 11,
          col: 3,
          offset: 38,
        },
      },
    },
  ],
};

describe("HeadingBoundariesDetector#detect", () => {
  test("should detect heading with subheadings", () => {
    const d = new HeadingBoundariesDetector(cache, 1);

    const result = d.detect();

    expect(result).toEqual({
      type: "heading",
      startLine: 1,
      endLine: 9,
    });
  });

  test("should return null if file is empty", () => {
    const d = new HeadingBoundariesDetector({}, 0);

    const result = d.detect();

    expect(result).toBeNull();
  });

  test("should return null if cursor not on heading", () => {
    const d = new HeadingBoundariesDetector(cache, 3);

    const result = d.detect();

    expect(result).toBeNull();
  });

  test("should detect subheading", () => {
    const d = new HeadingBoundariesDetector(cache, 5);

    const result = d.detect();

    expect(result).toEqual({
      type: "heading",
      startLine: 5,
      endLine: 9,
    });
  });

  test("should detect last heading", () => {
    const d = new HeadingBoundariesDetector(cache, 9);

    const result = d.detect();

    expect(result).toEqual({
      type: "heading",
      startLine: 9,
      endLine: 13,
    });
  });
});
