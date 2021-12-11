import { ListBoundariesDetector } from "../ListBoundariesDetector";

/*`
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
  1. 27
    1. 28
  2. 29

- 31
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
          col: 3,
          offset: 4,
        },
      },
      heading: "1",
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
          col: 3,
          offset: 4,
        },
      },
    },
    {
      type: "list",
      position: {
        start: {
          line: 3,
          col: 0,
          offset: 6,
        },
        end: {
          line: 11,
          col: 4,
          offset: 37,
        },
      },
    },
    {
      type: "paragraph",
      position: {
        start: {
          line: 13,
          col: 0,
          offset: 39,
        },
        end: {
          line: 13,
          col: 2,
          offset: 41,
        },
      },
    },
    {
      type: "list",
      position: {
        start: {
          line: 15,
          col: 0,
          offset: 43,
        },
        end: {
          line: 31,
          col: 4,
          offset: 128,
        },
      },
    },
  ],
  listItems: [
    {
      position: {
        start: {
          line: 3,
          col: 0,
          offset: 6,
        },
        end: {
          line: 3,
          col: 3,
          offset: 9,
        },
      },
      parent: -3,
    },
    {
      position: {
        start: {
          line: 4,
          col: 2,
          offset: 12,
        },
        end: {
          line: 4,
          col: 5,
          offset: 15,
        },
      },
      parent: 3,
    },
    {
      position: {
        start: {
          line: 5,
          col: 0,
          offset: 16,
        },
        end: {
          line: 6,
          col: 0,
          offset: 20,
        },
      },
      parent: -3,
    },
    {
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
      parent: -3,
    },
    {
      position: {
        start: {
          line: 9,
          col: 2,
          offset: 28,
        },
        end: {
          line: 9,
          col: 5,
          offset: 31,
        },
      },
      parent: 7,
    },
    {
      position: {
        start: {
          line: 11,
          col: 0,
          offset: 33,
        },
        end: {
          line: 11,
          col: 4,
          offset: 37,
        },
      },
      parent: -3,
    },
    {
      position: {
        start: {
          line: 15,
          col: 0,
          offset: 43,
        },
        end: {
          line: 16,
          col: 4,
          offset: 52,
        },
      },
      parent: -15,
    },
    {
      position: {
        start: {
          line: 18,
          col: 2,
          offset: 56,
        },
        end: {
          line: 18,
          col: 6,
          offset: 60,
        },
      },
      parent: 15,
    },
    {
      position: {
        start: {
          line: 19,
          col: 0,
          offset: 61,
        },
        end: {
          line: 20,
          col: 0,
          offset: 66,
        },
      },
      parent: -15,
    },
    {
      position: {
        start: {
          line: 21,
          col: 0,
          offset: 67,
        },
        end: {
          line: 21,
          col: 4,
          offset: 71,
        },
      },
      parent: -15,
    },
    {
      position: {
        start: {
          line: 22,
          col: 2,
          offset: 74,
        },
        end: {
          line: 24,
          col: 4,
          offset: 90,
        },
      },
      parent: 21,
    },
    {
      position: {
        start: {
          line: 26,
          col: 0,
          offset: 92,
        },
        end: {
          line: 26,
          col: 4,
          offset: 96,
        },
      },
      parent: -15,
    },
    {
      position: {
        start: {
          line: 27,
          col: 2,
          offset: 99,
        },
        end: {
          line: 27,
          col: 7,
          offset: 104,
        },
      },
      parent: 26,
    },
    {
      position: {
        start: {
          line: 28,
          col: 2,
          offset: 107,
        },
        end: {
          line: 28,
          col: 9,
          offset: 114,
        },
      },
      parent: 26,
    },
    {
      position: {
        start: {
          line: 29,
          col: 2,
          offset: 117,
        },
        end: {
          line: 29,
          col: 7,
          offset: 122,
        },
      },
      parent: 26,
    },
    {
      position: {
        start: {
          line: 31,
          col: 0,
          offset: 124,
        },
        end: {
          line: 31,
          col: 4,
          offset: 128,
        },
      },
      parent: -15,
    },
  ],
};

describe("ListBoundariesDetector#detect", () => {
  test("should detect list with sublists", () => {
    const d = new ListBoundariesDetector(cache, 3);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 3,
      endLine: 5,
    });
  });

  test("should not detect on empty line with no list before", () => {
    const d = new ListBoundariesDetector(cache, 2);

    const result = d.detect();

    expect(result).toBeNull();
  });

  test("should detect on empty line with list before", () => {
    const d = new ListBoundariesDetector(cache, 6);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 5,
      endLine: 7,
    });
  });

  test("should detect list with notes and sublists", () => {
    const d = new ListBoundariesDetector(cache, 17);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 15,
      endLine: 19,
    });
  });

  test("should stop if indent doesn't match", () => {
    const d = new ListBoundariesDetector(cache, 22);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 22,
      endLine: 24,
    });
  });

  test.only("should detect numeric list", () => {
    const d = new ListBoundariesDetector(cache, 27);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 27,
      endLine: 29,
    });
  });

  test("should detect last list", () => {
    const d = new ListBoundariesDetector(cache, 31);

    const result = d.detect();

    expect(result).toEqual({
      type: "list",
      startLine: 31,
      endLine: 33,
    });
  });
});
