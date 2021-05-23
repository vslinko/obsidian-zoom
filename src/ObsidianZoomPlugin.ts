import { Plugin } from "obsidian";
import {
  ObsidianZoomPluginSettingTab,
  SettingsService,
} from "./services/SettingsService";
import { IFeature } from "./features/IFeature";
import { ObsidianService } from "./services/ObsidianService";
import { LoggerService } from "./services/LoggerService";
import { ListsStylesFeature } from "./features/ListsStylesFeature";
import { ZoomFeature } from "./features/ZoomFeature";
import { ZoomStatesService } from "./services/ZoomStatesService";
import { ZoomService } from "./services/ZoomService";
import { ZoomOutAfterFileCotentChangedFeature } from "./features/ZoomOutAfterFileCotentChangedFeature";
import { ReZoomAfterContentChangedFeature } from "./features/ReZoomAfterContentChangedFeature";
import { LimitSelectionFeature } from "./features/LimitSelectionFeature";
import { ZoomOnClickFeature } from "./features/ZoomOnClickFeature";

export default class ObsidianZoomPlugin extends Plugin {
  private features: IFeature[];
  private settingsService: SettingsService;
  private loggerService: LoggerService;
  private zoomStatesService: ZoomStatesService;
  private obsidianService: ObsidianService;
  private zoomService: ZoomService;

  async onload() {
    console.log(`Loading obsidian-zoom`);

    this.settingsService = new SettingsService(this);
    await this.settingsService.load();

    this.loggerService = new LoggerService(this.settingsService);
    this.zoomStatesService = new ZoomStatesService();
    this.obsidianService = new ObsidianService(this.app);
    this.zoomService = new ZoomService(
      this.zoomStatesService,
      this.obsidianService
    );

    this.addSettingTab(
      new ObsidianZoomPluginSettingTab(this.app, this, this.settingsService)
    );

    this.features = [
      new ListsStylesFeature(this.settingsService),
      new ZoomFeature(this, this.obsidianService, this.zoomService),
      new ZoomOutAfterFileCotentChangedFeature(
        this,
        this.zoomStatesService,
        this.zoomService
      ),
      new ReZoomAfterContentChangedFeature(
        this,
        this.zoomStatesService,
        this.zoomService
      ),
      new LimitSelectionFeature(this, this.zoomStatesService),
      new ZoomOnClickFeature(this, this.settingsService, this.zoomService),
    ];

    for (const feature of this.features) {
      await feature.load();
    }
  }

  async onunload() {
    console.log(`Unloading obsidian-zoom`);

    for (const feature of this.features) {
      await feature.unload();
    }
  }
}
