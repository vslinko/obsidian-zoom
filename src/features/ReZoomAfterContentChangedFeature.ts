import { Plugin_2 } from "obsidian";
import { ZoomService } from "src/services/ZoomService";
import { ZoomStatesService } from "src/services/ZoomStatesService";
import { IFeature } from "./IFeature";

export class ReZoomAfterContentChangedFeature implements IFeature {
  constructor(
    private plugin: Plugin_2,
    private zoomStatesService: ZoomStatesService,
    private zoomService: ZoomService
  ) {}

  async load() {
    this.plugin.registerCodeMirror((cm) => {
      cm.on("change", this.handleChange);
    });
  }

  async unload() {
    this.plugin.app.workspace.iterateCodeMirrors((cm) => {
      cm.off("change", this.handleChange);
    });
  }

  private handleChange = (
    cm: CodeMirror.Editor,
    changeObj: CodeMirror.EditorChangeCancellable
  ) => {
    const zoomState = this.zoomStatesService.get(cm);

    if (!zoomState || changeObj.origin !== "setValue") {
      return;
    }

    const lineNo = cm.getLineNumber(zoomState.line);

    if (lineNo === null) {
      this.zoomService.zoomOut(cm);
      return;
    }

    this.zoomService.zoomIn(cm, {
      line: lineNo,
      ch: 0,
    });
  };
}
