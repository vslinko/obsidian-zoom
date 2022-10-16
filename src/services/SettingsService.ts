import { Platform } from "obsidian";

export interface ObsidianZoomPluginSettings {
  debug: boolean;
  zoomOnClick: boolean;
}

interface ObsidianZoomPluginSettingsJson {
  debug: boolean;
  zoomOnClick: boolean;
  zoomOnClickMobile: boolean;
}

const DEFAULT_SETTINGS: ObsidianZoomPluginSettingsJson = {
  debug: false,
  zoomOnClick: true,
  zoomOnClickMobile: false,
};

export interface Storage {
  loadData(): Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  saveData(settigns: any): Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type K = keyof ObsidianZoomPluginSettings;
type V<T extends K> = ObsidianZoomPluginSettings[T];
type Callback<T extends K> = (cb: V<T>) => void;

const zoomOnClickProp = Platform.isDesktop
  ? "zoomOnClick"
  : "zoomOnClickMobile";

const mappingToJson = {
  zoomOnClick: zoomOnClickProp,
  debug: "debug",
} as {
  [key in keyof ObsidianZoomPluginSettings]: keyof ObsidianZoomPluginSettingsJson;
};

export class SettingsService implements ObsidianZoomPluginSettings {
  private storage: Storage;
  private values: ObsidianZoomPluginSettingsJson;
  private handlers: Map<K, Set<Callback<K>>>;

  constructor(storage: Storage) {
    this.storage = storage;
    this.handlers = new Map();
  }

  get debug() {
    return this.values.debug;
  }
  set debug(value: boolean) {
    this.set("debug", value);
  }

  get zoomOnClick() {
    return this.values[mappingToJson.zoomOnClick];
  }
  set zoomOnClick(value: boolean) {
    this.set("zoomOnClick", value);
  }

  onChange<T extends K>(key: T, cb: Callback<T>) {
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }

    this.handlers.get(key).add(cb);
  }

  removeCallback<T extends K>(key: T, cb: Callback<T>): void {
    const handlers = this.handlers.get(key);

    if (handlers) {
      handlers.delete(cb);
    }
  }

  async load() {
    this.values = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.storage.loadData()
    );
  }

  async save() {
    await this.storage.saveData(this.values);
  }

  private set<T extends K>(key: T, value: V<K>): void {
    this.values[mappingToJson[key]] = value;
    const callbacks = this.handlers.get(key);

    if (!callbacks) {
      return;
    }

    for (const cb of callbacks.values()) {
      cb(value);
    }
  }
}
