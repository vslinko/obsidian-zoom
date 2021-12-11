import { App, CachedMetadata, MarkdownView, WorkspaceLeaf } from "obsidian";

export class ObsidianService {
  constructor(private app: App) {}

  getActiveLeafDisplayText() {
    return this.app.workspace.activeLeaf.getDisplayText();
  }

  getCacheByEditor(editor: CodeMirror.Editor): CachedMetadata | null {
    let leaf: WorkspaceLeaf | null = null;

    this.app.workspace.iterateAllLeaves((l) => {
      const view = l.view as any;
      if (view && view.sourceMode && view.sourceMode.cmEditor === editor) {
        leaf = l;
      }
    });

    if (!leaf) {
      return null;
    }

    return this.app.metadataCache.getFileCache(
      (leaf.view as MarkdownView).file
    );
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
