import { RangeSet, RangeValue } from "@codemirror/rangeset";

export function rangeSetToArray<T extends RangeValue>(
  rs: RangeSet<T>
): Array<{ from: number; to: number }> {
  const res = [];
  const i = rs.iter();
  while (i.value !== null) {
    res.push({ from: i.from, to: i.to });
    i.next();
  }
  return res;
}
