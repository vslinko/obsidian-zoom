import { Editor, Plugin } from "obsidian";

import { Feature } from "./features/Feature";
import { HeaderNavigationFeature } from "./features/HeaderNavigationFeature";
import { LimitSelectionFeature } from "./features/LimitSelectionFeature";
import { ListsStylesFeature } from "./features/ListsStylesFeature";
import { ResetZoomWhenVisibleContentBoundariesViolatedFeature } from "./features/ResetZoomWhenVisibleContentBoundariesViolatedFeature";
import { SettingsTabFeature } from "./features/SettingsTabFeature";
import { ZoomFeature } from "./features/ZoomFeature";
import { ZoomOnClickFeature } from "./features/ZoomOnClickFeature";
import { LoggerService } from "./services/LoggerService";
import { SettingsService } from "./services/SettingsService";
import { getEditorViewFromEditor } from "./utils/getEditorViewFromEditor";

declare global {
  interface Window {
    ObsidianZoomPlugin?: ObsidianZoomPlugin;
  }
}

export default class ObsidianZoomPlugin extends Plugin {
  protected zoomFeature: ZoomFeature;
  protected features: Feature[];

  async onload() {
    console.log(`Loading obsidian-zoom`);

    window.ObsidianZoomPlugin = this;

    const settings = new SettingsService(this);
    await settings.load();

    const logger = new LoggerService(settings);

    const settingsTabFeature = new SettingsTabFeature(this, settings);
    this.zoomFeature = new ZoomFeature(this, logger);
    const limitSelectionFeature = new LimitSelectionFeature(
      this,
      logger,
      this.zoomFeature
    );
    const resetZoomWhenVisibleContentBoundariesViolatedFeature =
      new ResetZoomWhenVisibleContentBoundariesViolatedFeature(
        this,
        logger,
        this.zoomFeature,
        this.zoomFeature
      );
    const headerNavigationFeature = new HeaderNavigationFeature(
      this,
      logger,
      this.zoomFeature,
      this.zoomFeature,
      this.zoomFeature,
      this.zoomFeature,
      this.zoomFeature,
      this.zoomFeature
    );
    const zoomOnClickFeature = new ZoomOnClickFeature(
      this,
      settings,
      this.zoomFeature
    );
    const listsStylesFeature = new ListsStylesFeature(settings);

    this.features = [
      settingsTabFeature,
      this.zoomFeature,
      limitSelectionFeature,
      resetZoomWhenVisibleContentBoundariesViolatedFeature,
      headerNavigationFeature,
      zoomOnClickFeature,
      listsStylesFeature,
    ];

    for (const feature of this.features) {
      await feature.load();
    }
  }

  async onunload() {
    console.log(`Unloading obsidian-zoom`);

    delete window.ObsidianZoomPlugin;

    for (const feature of this.features) {
      await feature.unload();
    }
  }

  public getZoomRange(editor: Editor) {
    const cm = getEditorViewFromEditor(editor);
    const range = this.zoomFeature.calculateVisibleContentRange(cm.state);

    if (!range) {
      return null;
    }

    const from = cm.state.doc.lineAt(range.from);
    const to = cm.state.doc.lineAt(range.to);

    return {
      from: {
        line: from.number - 1,
        ch: range.from - from.from,
      },
      to: {
        line: to.number - 1,
        ch: range.to - to.from,
      },
    };
  }

  public zoomOut(editor: Editor) {
    this.zoomFeature.zoomOut(getEditorViewFromEditor(editor));
  }

  public zoomIn(editor: Editor, line: number) {
    const cm = getEditorViewFromEditor(editor);
    const pos = cm.state.doc.line(line + 1).from;
    this.zoomFeature.zoomIn(cm, pos);
  }

  public refreshZoom(editor: Editor) {
    this.zoomFeature.refreshZoom(getEditorViewFromEditor(editor));
  }
}
