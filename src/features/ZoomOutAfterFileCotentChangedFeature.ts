import { Plugin_2 } from "obsidian";
import { ZoomService } from "src/services/ZoomService";
import { ZoomStatesService } from "src/services/ZoomStatesService";
import { IFeature } from "./IFeature";

export class ZoomOutAfterFileCotentChangedFeature implements IFeature {
  constructor(
    private plugin: Plugin_2,
    private zoomStatesService: ZoomStatesService,
    private zoomService: ZoomService
  ) {}

  async load() {
    this.plugin.registerCodeMirror((cm) => {
      cm.on("beforeChange", this.handleBeforeChange);
    });
  }

  async unload() {
    this.plugin.app.workspace.iterateCodeMirrors((cm) => {
      cm.off("beforeChange", this.handleBeforeChange);
    });
  }

  private handleBeforeChange = (
    cm: CodeMirror.Editor,
    changeObj: CodeMirror.EditorChangeCancellable
  ) => {
    const zoomState = this.zoomStatesService.get(cm);

    if (
      !zoomState ||
      changeObj.origin !== "setValue" ||
      changeObj.from.line !== 0 ||
      changeObj.from.ch !== 0
    ) {
      return;
    }

    const tillLine = cm.lastLine();
    const tillCh = cm.getLine(tillLine).length;

    if (changeObj.to.line !== tillLine || changeObj.to.ch !== tillCh) {
      return;
    }

    this.zoomService.zoomOut(cm);
  };
}
