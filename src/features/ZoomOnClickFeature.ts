import { Plugin_2 } from "obsidian";

import { EditorView } from "@codemirror/view";

import { Feature } from "./Feature";

import { DetectClickOnBullet } from "../logic/DetectClickOnBullet";
import { SettingsService } from "../services/SettingsService";

export interface ZoomIn {
  zoomIn(view: EditorView, pos: number): void;
}

export class ZoomOnClickFeature implements Feature {
  private detectClickOnBullet = new DetectClickOnBullet(this.settings, {
    clickOnBullet: (view, pos) => this.clickOnBullet(view, pos),
  });

  constructor(
    private plugin: Plugin_2,
    private settings: SettingsService,
    private zoomIn: ZoomIn
  ) {}

  async load() {
    this.plugin.registerEditorExtension(
      this.detectClickOnBullet.getExtension()
    );
  }

  async unload() {}

  private clickOnBullet(view: EditorView, pos: number) {
    this.detectClickOnBullet.moveCursorToLineEnd(view, pos);
    this.zoomIn.zoomIn(view, pos);
  }
}
