import { EditorSelection } from "@codemirror/state";

export function calculateLimitedSelection(
  selection: EditorSelection,
  from: number,
  to: number
) {
  const mainSelection = selection.main;

  const newSelection = EditorSelection.range(
    Math.min(Math.max(mainSelection.anchor, from), to),
    Math.min(Math.max(mainSelection.head, from), to),
    mainSelection.goalColumn
  );

  const shouldUpdate =
    selection.ranges.length > 1 ||
    newSelection.anchor !== mainSelection.anchor ||
    newSelection.head !== mainSelection.head;

  return shouldUpdate ? newSelection : null;
}
