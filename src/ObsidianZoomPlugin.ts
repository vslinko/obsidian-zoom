import { Notice, Plugin, addIcon } from "obsidian";

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

addIcon(
  "obsidian-zoom-zoom-in",
  `<path fill="currentColor" stroke="currentColor" stroke-width="2" d="M42,6C23.2,6,8,21.2,8,40s15.2,34,34,34c7.4,0,14.3-2.4,19.9-6.4l26.3,26.3l5.6-5.6l-26-26.1c5.1-6,8.2-13.7,8.2-22.1 C76,21.2,60.8,6,42,6z M42,10c16.6,0,30,13.4,30,30S58.6,70,42,70S12,56.6,12,40S25.4,10,42,10z"></path><line x1="24" y1="40" x2="60" y2="40" stroke="currentColor" stroke-width="10"></line><line x1="42" y1="20" x2="42" y2="60" stroke="currentColor" stroke-width="10"></line>`
);
addIcon(
  "obsidian-zoom-zoom-out",
  `<path fill="currentColor" stroke="currentColor" stroke-width="2" d="M42,6C23.2,6,8,21.2,8,40s15.2,34,34,34c7.4,0,14.3-2.4,19.9-6.4l26.3,26.3l5.6-5.6l-26-26.1c5.1-6,8.2-13.7,8.2-22.1 C76,21.2,60.8,6,42,6z M42,10c16.6,0,30,13.4,30,30S58.6,70,42,70S12,56.6,12,40S25.4,10,42,10z"></path><line x1="24" y1="40" x2="60" y2="40" stroke="currentColor" stroke-width="10"></line>`
);

export default class ObsidianZoomPlugin extends Plugin {
  protected features: Feature[];

  async onload() {
    console.log(`Loading obsidian-zoom`);

    if (this.isLegacyEditorEnabled()) {
      new Notice(
        `Zoom plugin does not support legacy editor mode starting from version 0.2. Please disable the "Use legacy editor" option or manually install version 0.1 of Zoom plugin.`,
        30000
      );
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ObsidianZoomPlugin = this;

    const settings = new SettingsService(this);
    await settings.load();

    const logger = new LoggerService(settings);

    const settingsTabFeature = new SettingsTabFeature(this, settings);
    const zoomFeature = new ZoomFeature(this, logger);
    const limitSelectionFeature = new LimitSelectionFeature(this, zoomFeature);
    const resetZoomWhenVisibleContentBoundariesViolatedFeature =
      new ResetZoomWhenVisibleContentBoundariesViolatedFeature(
        this,
        zoomFeature,
        zoomFeature
      );
    const headerNavigationFeature = new HeaderNavigationFeature(
      this,
      logger,
      zoomFeature,
      zoomFeature,
      zoomFeature,
      zoomFeature,
      zoomFeature,
      zoomFeature
    );
    const zoomOnClickFeature = new ZoomOnClickFeature(
      this,
      settings,
      zoomFeature
    );
    const listsStylesFeature = new ListsStylesFeature(settings);

    this.features = [
      settingsTabFeature,
      zoomFeature,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).ObsidianZoomPlugin;

    for (const feature of this.features) {
      await feature.unload();
    }
  }

  private isLegacyEditorEnabled() {
    const config: { legacyEditor: boolean } = {
      legacyEditor: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(this.app.vault as any).config,
    };

    return config.legacyEditor;
  }
}
