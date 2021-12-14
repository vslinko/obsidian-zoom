import { editorEditorField } from "obsidian";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

export function getEditorViewFromEditorState(state: EditorState): EditorView {
  return state.field(editorEditorField);
}
