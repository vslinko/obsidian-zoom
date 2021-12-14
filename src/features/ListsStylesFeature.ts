import { Feature } from "./Feature";

import { SettingsService } from "../services/SettingsService";

export class ListsStylesFeature implements Feature {
  constructor(private settings: SettingsService) {}

  async load() {
    if (this.settings.zoomOnClick) {
      this.addZoomStyles();
    }

    this.settings.onChange("zoomOnClick", this.onZoomOnClickSettingChange);
  }

  async unload() {
    this.settings.removeCallback(
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
