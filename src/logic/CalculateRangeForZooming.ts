import { foldable } from "@codemirror/language";
import { EditorState } from "@codemirror/state";

export class CalculateRangeForZooming {
  public calculateRangeForZooming(state: EditorState, pos: number) {
    const line = state.doc.lineAt(pos);
    const foldRange = foldable(state, line.from, line.to);

    if (!foldRange && /^\s*([-*+]|\d+\.)\s+/.test(line.text)) {
      return { from: line.from, to: line.to };
    }

    if (!foldRange) {
      return null;
    }

    return { from: line.from, to: foldRange.to };
  }
}
