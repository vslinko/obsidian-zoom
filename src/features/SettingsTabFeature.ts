import { App, PluginSettingTab, Plugin_2, Setting } from "obsidian";

import { Feature } from "./Feature";

import { SettingsService } from "../services/SettingsService";

class ObsidianZoomPluginSettingTab extends PluginSettingTab {
  constructor(app: App, plugin: Plugin_2, private settings: SettingsService) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Zooming in when clicking on the bullet")
      .addToggle((toggle) => {
        toggle.setValue(this.settings.zoomOnClick).onChange(async (value) => {
          this.settings.zoomOnClick = value;
          await this.settings.save();
        });
      });

    new Setting(containerEl)
      .setName("Debug mode")
      .setDesc(
        "Open DevTools (Command+Option+I or Control+Shift+I) to copy the debug logs."
      )
      .addToggle((toggle) => {
        toggle.setValue(this.settings.debug).onChange(async (value) => {
          this.settings.debug = value;
          await this.settings.save();
        });
      });
  }
}

export class SettingsTabFeature implements Feature {
  constructor(private plugin: Plugin_2, private settings: SettingsService) {}

  async load() {
    this.plugin.addSettingTab(
      new ObsidianZoomPluginSettingTab(
        this.plugin.app,
        this.plugin,
        this.settings
      )
    );
  }

  async unload() {}
}
