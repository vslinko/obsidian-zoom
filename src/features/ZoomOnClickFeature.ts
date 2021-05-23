import { Plugin_2 } from "obsidian";
import { ZoomService } from "src/services/ZoomService";
import { SettingsService } from "../services/SettingsService";
import { IFeature } from "./IFeature";

export class ZoomOnClickFeature implements IFeature {
  constructor(
    private plugin: Plugin_2,
    private settingsService: SettingsService,
    private zoomService: ZoomService
  ) {}

  async load() {
    this.plugin.registerDomEvent(window, "click", this.handleClick);
  }

  async unload() {}

  private handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;

    if (
      !target ||
      !this.settingsService.zoomOnClick ||
      !target.classList.contains("cm-formatting-list-ul")
    ) {
      return;
    }

    let wrap = target;
    while (wrap) {
      if (wrap.classList.contains("CodeMirror-wrap")) {
        break;
      }
      wrap = wrap.parentElement;
    }

    if (!wrap) {
      return;
    }

    let foundEditor: CodeMirror.Editor | null = null;

    this.plugin.app.workspace.iterateCodeMirrors((cm) => {
      if (foundEditor) {
        return;
      }

      if (cm.getWrapperElement() === wrap) {
        foundEditor = cm;
      }
    });

    if (!foundEditor) {
      return;
    }

    const pos = foundEditor.coordsChar({
      left: e.x,
      top: e.y,
    });

    if (!pos) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    this.zoomService.zoomIn(foundEditor, pos);

    foundEditor.setCursor({
      line: pos.line,
      ch: foundEditor.getLine(pos.line).length,
    });
  };
}
