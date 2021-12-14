import { EditorState, Transaction } from "@codemirror/state";

import { calculateLimitedSelection } from "./utils/calculateLimitedSelection";

export interface CalculateVisibleContentRange {
  calculateVisibleContentRange(
    state: EditorState
  ): { from: number; to: number } | null;
}

export class LimitSelectionWhenZoomedIn {
  constructor(
    private calculateVisibleContentRange: CalculateVisibleContentRange
  ) {}

  public getExtension() {
    return EditorState.transactionFilter.of(this.limitSelectionWhenZoomedIn);
  }

  private limitSelectionWhenZoomedIn = (tr: Transaction) => {
    if (!tr.selection) {
      return tr;
    }

    const range =
      this.calculateVisibleContentRange.calculateVisibleContentRange(
        tr.startState
      );

    if (!range) {
      return tr;
    }

    const newSelection = calculateLimitedSelection(
      tr.newSelection,
      range.from,
      range.to
    );

    if (!newSelection) {
      return tr;
    }

    return [tr, { selection: newSelection }];
  };
}
