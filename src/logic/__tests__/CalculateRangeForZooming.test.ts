import { EditorState } from "@codemirror/state";

import { CalculateRangeForZooming } from "../CalculateRangeForZooming";

jest.mock("@codemirror/language", () => {
  return {
    foldable: jest.fn(),
  };
});

const foldable: jest.Mock = jest.requireMock("@codemirror/language").foldable;

beforeEach(() => {
  foldable.mockReturnValue(null);
});

test("should return nothing if block is unfoldable", () => {
  foldable.mockReturnValue(null);
  const state = EditorState.create({
    doc: "# header\n\nline1\n",
  });
  const calculateRangeForZooming = new CalculateRangeForZooming();

  const x = calculateRangeForZooming.calculateRangeForZooming(state, 1);

  expect(x).toBeNull();
});

test("should return range from line start if block is foldable", () => {
  foldable.mockReturnValue({ from: 8, to: 16 });
  const state = EditorState.create({
    doc: "# header\n\nline1\n",
  });
  const calculateRangeForZooming = new CalculateRangeForZooming();

  const x = calculateRangeForZooming.calculateRangeForZooming(state, 1);

  expect(x).toStrictEqual({ from: 0, to: 16 });
});

test("should return range of current line if block is unfoldable but line is list item", () => {
  foldable.mockReturnValue(null);
  const state = EditorState.create({
    doc: "line\n\n- list\n\nline",
  });
  const calculateRangeForZooming = new CalculateRangeForZooming();

  const x = calculateRangeForZooming.calculateRangeForZooming(state, 8);

  expect(x).toStrictEqual({ from: 6, to: 12 });
});
