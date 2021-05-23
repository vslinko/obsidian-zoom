import { Plugin_2 } from "obsidian";
import { ZoomStatesService } from "src/services/ZoomStatesService";
import { IFeature } from "./IFeature";

export class LimitSelectionFeature implements IFeature {
  constructor(
    private plugin: Plugin_2,
    private zoomStatesService: ZoomStatesService
  ) {}

  async load() {
    this.plugin.registerCodeMirror((cm) => {
      cm.on("beforeSelectionChange", this.handleBeforeSelectionChange);
    });
  }

  async unload() {
    this.plugin.app.workspace.iterateCodeMirrors((cm) => {
      cm.off("beforeSelectionChange", this.handleBeforeSelectionChange);
    });
  }

  private handleBeforeSelectionChange = (
    cm: CodeMirror.Editor,
    changeObj: CodeMirror.EditorSelectionChange
  ) => {
    if (!this.zoomStatesService.has(cm)) {
      return;
    }

    let visibleFrom: CodeMirror.Position | null = null;
    let visibleTill: CodeMirror.Position | null = null;

    for (let i = cm.firstLine(); i <= cm.lastLine(); i++) {
      const wrapClass = cm.lineInfo(i).wrapClass || "";
      const isHidden = wrapClass.includes("zoom-plugin-hidden-row");
      if (visibleFrom === null && !isHidden) {
        visibleFrom = { line: i, ch: 0 };
      }
      if (visibleFrom !== null && visibleTill !== null && isHidden) {
        break;
      }
      if (visibleFrom !== null) {
        visibleTill = { line: i, ch: cm.getLine(i).length };
      }
    }

    let changed = false;

    for (const range of changeObj.ranges) {
      if (range.anchor.line < visibleFrom.line) {
        changed = true;
        range.anchor.line = visibleFrom.line;
        range.anchor.ch = visibleFrom.ch;
      }
      if (range.anchor.line > visibleTill.line) {
        changed = true;
        range.anchor.line = visibleTill.line;
        range.anchor.ch = visibleTill.ch;
      }
      if (range.head.line < visibleFrom.line) {
        changed = true;
        range.head.line = visibleFrom.line;
        range.head.ch = visibleFrom.ch;
      }
      if (range.head.line > visibleTill.line) {
        changed = true;
        range.head.line = visibleTill.line;
        range.head.ch = visibleTill.ch;
      }
    }

    if (changed) {
      changeObj.update(changeObj.ranges);
    }
  };
}
