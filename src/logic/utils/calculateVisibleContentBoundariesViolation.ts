import { Transaction } from "@codemirror/state";

export function calculateVisibleContentBoundariesViolation(
  tr: Transaction,
  hiddenRanges: Array<{ from: number; to: number }>
) {
  let touchedBefore = false;
  let touchedAfter = false;
  let touchedInside = false;

  const t = (f: number, t: number) => Boolean(tr.changes.touchesRange(f, t));

  if (hiddenRanges.length === 2) {
    const [a, b] = hiddenRanges;

    touchedBefore = t(a.from, a.to);
    touchedInside = t(a.to + 1, b.from - 1);
    touchedAfter = t(b.from, b.to);
  }

  if (hiddenRanges.length === 1) {
    const [a] = hiddenRanges;

    if (a.from === 0) {
      touchedBefore = t(a.from, a.to);
      touchedInside = t(a.to + 1, tr.newDoc.length);
    } else {
      touchedInside = t(0, a.from - 1);
      touchedAfter = t(a.from, a.to);
    }
  }

  const touchedOutside = touchedBefore || touchedAfter;

  const res = {
    touchedOutside,
    touchedBefore,
    touchedAfter,
    touchedInside,
  };

  return res;
}
