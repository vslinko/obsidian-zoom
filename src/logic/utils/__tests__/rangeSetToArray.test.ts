import { RangeSetBuilder } from "@codemirror/rangeset";
import { Decoration } from "@codemirror/view";

import { rangeSetToArray } from "../rangeSetToArray";

test("should return array of ranges", () => {
  const dec = Decoration.replace({});
  const rsb = new RangeSetBuilder();
  rsb.add(1, 2, dec);
  rsb.add(10, 20, dec);
  rsb.add(30, 40, dec);
  const rs = rsb.finish();

  const ranges = rangeSetToArray(rs);

  expect(ranges).toStrictEqual([
    { from: 1, to: 2 },
    { from: 10, to: 20 },
    { from: 30, to: 40 },
  ]);
});
