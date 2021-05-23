import { SettingsService } from "../services/SettingsService";
import { IFeature } from "./IFeature";

export class ListsStylesFeature implements IFeature {
  constructor(private settingsService: SettingsService) {}

  async load() {
    if (this.settingsService.zoomOnClick) {
      this.addZoomStyles();
    }

    this.settingsService.onChange(
      "zoomOnClick",
      this.onZoomOnClickSettingChange
    );
  }

  async unload() {
    this.settingsService.removeCallback(
      "zoomOnClick",
      this.onZoomOnClickSettingChange
    );

    this.removeZoomStyles();
  }

  private onZoomOnClickSettingChange = (zoomOnClick: boolean) => {
    if (zoomOnClick) {
      this.addZoomStyles();
    } else {
      this.removeZoomStyles();
    }
  };

  private addZoomStyles() {
    document.body.classList.add("zoom-plugin-bls-zoom");
  }

  private removeZoomStyles() {
    document.body.classList.remove("zoom-plugin-bls-zoom");
  }
}
