import { Plugin_2 } from "obsidian";
import { ZoomService } from "src/services/ZoomService";
import { ObsidianService } from "../services/ObsidianService";
import { IFeature } from "./IFeature";

export class ZoomFeature implements IFeature {
  constructor(
    private plugin: Plugin_2,
    private obsidianService: ObsidianService,
    private zoomService: ZoomService
  ) {}

  async load() {
    this.plugin.addCommand({
      id: "zoom-in",
      name: "Zoom in to the current list item",
      callback: this.obsidianService.createCommandCallback(
        this.zoomService.zoomIn.bind(this.zoomService)
      ),
      hotkeys: [
        {
          modifiers: ["Mod"],
          key: ".",
        },
      ],
    });

    this.plugin.addCommand({
      id: "zoom-out",
      name: "Zoom out the entire document",
      callback: this.obsidianService.createCommandCallback(
        this.zoomService.zoomOut.bind(this.zoomService)
      ),
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: ".",
        },
      ],
    });
  }

  async unload() {}
}
