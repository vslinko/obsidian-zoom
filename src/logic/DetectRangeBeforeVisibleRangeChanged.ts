import { EditorState, Transaction } from "@codemirror/state";

import { calculateVisibleContentBoundariesViolation } from "./utils/calculateVisibleContentBoundariesViolation";

export interface RangeBeforeVisibleRangeChanged {
  rangeBeforeVisibleRangeChanged(state: EditorState): void;
}

export interface CalculateHiddenContentRanges {
  calculateHiddenContentRanges(
    state: EditorState
  ): { from: number; to: number }[] | null;
}

export class DetectRangeBeforeVisibleRangeChanged {
  constructor(
    private calculateHiddenContentRanges: CalculateHiddenContentRanges,
    private rangeBeforeVisibleRangeChanged: RangeBeforeVisibleRangeChanged
  ) {}

  getExtension() {
    return EditorState.transactionExtender.of(
      this.detectVisibleContentBoundariesViolation
    );
  }

  private detectVisibleContentBoundariesViolation = (tr: Transaction): null => {
    const hiddenRanges =
      this.calculateHiddenContentRanges.calculateHiddenContentRanges(
        tr.startState
      );

    const { touchedBefore, touchedInside } =
      calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

    if (touchedBefore && !touchedInside) {
      setImmediate(() => {
        this.rangeBeforeVisibleRangeChanged.rangeBeforeVisibleRangeChanged(
          tr.state
        );
      });
    }

    return null;
  };
}
