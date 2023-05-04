import { Editor } from "obsidian";

import { EditorView } from "@codemirror/view";

export function getEditorViewFromEditor(editor: Editor): EditorView {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (editor as any).cm;
}
