import { EditorState } from "@codemirror/state";

import { CollectBreadcrumbs } from "../CollectBreadcrumbs";

jest.mock("@codemirror/language", () => {
  return {
    foldable: jest.fn(),
  };
});

const getDocumentTitle = { getDocumentTitle: () => "Document" };
const foldable: jest.Mock = jest.requireMock("@codemirror/language").foldable;

test("should return breadcrumbs based on folable zones that should include input position", () => {
  const state = EditorState.create({
    doc: "# a\n\n# b\n\n## c\n\n- 1\n\t- 2\n\t\t- 3\n\n### d\n\n# e\n\nf",
    //    0123 4 5678 9 01234 5 6789 0 1234 5 6 7890 1 234567 8 9012 3 45
    //                  1            2             3             4
  });
  foldable.mockImplementation((state, from) => {
    if (from === 0) return { from: 0, to: 4 };
    if (from === 5) return { from: 5, to: 38 };
    if (from === 10) return { from: 10, to: 38 };
    if (from === 16) return { from: 16, to: 29 };
    if (from === 20) return { from: 20, to: 29 };
    if (from === 32) return { from: 32, to: 38 };
    if (from === 39) return { from: 39, to: 44 };
    return null;
  });

  const collectBreadcrumbs = new CollectBreadcrumbs(getDocumentTitle);

  const b = collectBreadcrumbs.collectBreadcrumbs(state, 28);

  expect(b).toStrictEqual([
    { title: "Document", pos: null },
    { title: "b", pos: 5 },
    { title: "c", pos: 10 },
    { title: "1", pos: 16 },
    { title: "2", pos: 20 },
    { title: "3", pos: 25 },
  ]);
});
