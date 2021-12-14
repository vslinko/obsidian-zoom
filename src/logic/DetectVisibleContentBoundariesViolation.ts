import { EditorState, Transaction } from "@codemirror/state";

import { calculateVisibleContentBoundariesViolation } from "./utils/calculateVisibleContentBoundariesViolation";

export interface VisibleContentBoundariesViolated {
  visibleContentBoundariesViolated(state: EditorState): void;
}

export interface CalculateHiddenContentRanges {
  calculateHiddenContentRanges(
    state: EditorState
  ): { from: number; to: number }[] | null;
}

export class DetectVisibleContentBoundariesViolation {
  constructor(
    private calculateHiddenContentRanges: CalculateHiddenContentRanges,
    private visibleContentBoundariesViolated: VisibleContentBoundariesViolated
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

    const { touchedOutside, touchedInside } =
      calculateVisibleContentBoundariesViolation(tr, hiddenRanges);

    if (touchedOutside && touchedInside) {
      setImmediate(() => {
        this.visibleContentBoundariesViolated.visibleContentBoundariesViolated(
          tr.state
        );
      });
    }

    return null;
  };
}
