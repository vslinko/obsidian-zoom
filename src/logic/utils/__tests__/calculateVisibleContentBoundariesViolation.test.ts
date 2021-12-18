import { EditorState } from "@codemirror/state";

import { calculateVisibleContentBoundariesViolation } from "../calculateVisibleContentBoundariesViolation";

const state = EditorState.create({ doc: "line1\nline2\nline3" });
const hiddenRanges = [
  { from: 0, to: 5 },
  { from: 12, to: 17 },
];

test("should calculate correctly when changes are touching area before visible content", () => {
  const tr = state.update({ changes: { from: 0, to: 1, insert: "X" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeTruthy();
  expect(res.touchedAfter).toBeFalsy();
  expect(res.touchedOutside).toBeTruthy();
  expect(res.touchedInside).toBeFalsy();
});

test("should calculate correctly when changes are touching area after visible content", () => {
  const tr = state.update({ changes: { from: 12, to: 13, insert: "X" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeFalsy();
  expect(res.touchedAfter).toBeTruthy();
  expect(res.touchedOutside).toBeTruthy();
  expect(res.touchedInside).toBeFalsy();
});

test("should calculate correctly when changes are touching visible content", () => {
  const tr = state.update({ changes: { from: 6, to: 7, insert: "X" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeFalsy();
  expect(res.touchedAfter).toBeFalsy();
  expect(res.touchedOutside).toBeFalsy();
  expect(res.touchedInside).toBeTruthy();
});

test("should calculate correctly when changes are crossing first boundary of visible content", () => {
  const tr = state.update({ changes: { from: 4, to: 7, insert: "X" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeTruthy();
  expect(res.touchedAfter).toBeFalsy();
  expect(res.touchedOutside).toBeTruthy();
  expect(res.touchedInside).toBeTruthy();
});

test("should calculate correctly when changes are crossing second boundary of visible content", () => {
  const tr = state.update({ changes: { from: 8, to: 13, insert: "X" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeFalsy();
  expect(res.touchedAfter).toBeTruthy();
  expect(res.touchedOutside).toBeTruthy();
  expect(res.touchedInside).toBeTruthy();
});

test("should calculate correctly when changes are removing newline just before first boundary of visible content", () => {
  const tr = state.update({ changes: { from: 5, to: 6, insert: "" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeTruthy();
  expect(res.touchedAfter).toBeFalsy();
  expect(res.touchedOutside).toBeTruthy();
  expect(res.touchedInside).toBeTruthy();
});

test("should calculate correctly when changes are removing newline just after second boundary of visible content", () => {
  const tr = state.update({ changes: { from: 11, to: 12, insert: "" } });

  const res = calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

  expect(res.touchedBefore).toBeFalsy();
  expect(res.touchedAfter).toBeTruthy();
  expect(res.touchedOutside).toBeTruthy();
  expect(res.touchedInside).toBeTruthy();
});
