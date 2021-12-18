import { EditorSelection } from "@codemirror/state";

import { calculateLimitedSelection } from "../calculateLimitedSelection";

test("should limit selection if visible area is smaller", () => {
  const selection = EditorSelection.create([EditorSelection.range(10, 20)]);
  const visibleArea = [12, 18];

  const newSelection = calculateLimitedSelection(
    selection,
    visibleArea[0],
    visibleArea[1]
  );

  expect(newSelection.from).toBe(12);
  expect(newSelection.to).toBe(18);
});

test("should limit selection if visible area ends before selection", () => {
  const selection = EditorSelection.create([EditorSelection.range(10, 20)]);
  const visibleArea = [1, 18];

  const newSelection = calculateLimitedSelection(
    selection,
    visibleArea[0],
    visibleArea[1]
  );

  expect(newSelection.from).toBe(10);
  expect(newSelection.to).toBe(18);
});

test("should limit selection if visible area starts after selection", () => {
  const selection = EditorSelection.create([EditorSelection.range(10, 20)]);
  const visibleArea = [12, 30];

  const newSelection = calculateLimitedSelection(
    selection,
    visibleArea[0],
    visibleArea[1]
  );

  expect(newSelection.from).toBe(12);
  expect(newSelection.to).toBe(20);
});

test("should not limit selection if visible area is bigger", () => {
  const selection = EditorSelection.create([EditorSelection.range(10, 20)]);
  const visibleArea = [1, 30];

  const newSelection = calculateLimitedSelection(
    selection,
    visibleArea[0],
    visibleArea[1]
  );

  expect(newSelection).toBeNull();
});
