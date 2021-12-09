import { App, MarkdownView } from "obsidian";

export class ObsidianService {
  constructor(private app: App) {}

  getActiveLeafDisplayText() {
    return this.app.workspace.activeLeaf.getDisplayText();
  }

  createCommandCallback(cb: (editor: CodeMirror.Editor) => boolean) {
    return () => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);

      if (!view) {
        return;
      }

      const editor = (view as any).sourceMode.cmEditor;

      const shouldStopPropagation = cb(editor);

      if (
        !shouldStopPropagation &&
        window.event &&
        window.event.type === "keydown"
      ) {
        (editor as any).triggerOnKeyDown(window.event);
      }
    };
  }
}
