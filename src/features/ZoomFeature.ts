import { Notice, Plugin_2 } from "obsidian";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { Feature } from "./Feature";
import { isFoldingEnabled } from "./utils/isFoldingEnabled";

import { CalculateRangeForZooming } from "../logic/CalculateRangeForZooming";
import { KeepOnlyZoomedContentVisible } from "../logic/KeepOnlyZoomedContentVisible";
import { LoggerService } from "../services/LoggerService";

export type ZoomInCallback = (view: EditorView, pos: number) => void;
export type ZoomOutCallback = (view: EditorView) => void;

export class ZoomFeature implements Feature {
  private zoomInCallbacks: ZoomInCallback[] = [];
  private zoomOutCallbacks: ZoomOutCallback[] = [];

  private keepOnlyZoomedContentVisible = new KeepOnlyZoomedContentVisible(
    this.logger
  );

  private calculateRangeForZooming = new CalculateRangeForZooming();

  constructor(private plugin: Plugin_2, private logger: LoggerService) {}

  public calculateVisibleContentRange(state: EditorState) {
    return this.keepOnlyZoomedContentVisible.calculateVisibleContentRange(
      state
    );
  }

  public calculateHiddenContentRanges(state: EditorState) {
    return this.keepOnlyZoomedContentVisible.calculateHiddenContentRanges(
      state
    );
  }

  public notifyAfterZoomIn(cb: ZoomInCallback) {
    this.zoomInCallbacks.push(cb);
  }

  public notifyAfterZoomOut(cb: ZoomOutCallback) {
    this.zoomOutCallbacks.push(cb);
  }

  public refreshZoom(view: EditorView) {
    const prevRange =
      this.keepOnlyZoomedContentVisible.calculateVisibleContentRange(
        view.state
      );

    if (!prevRange) {
      return;
    }

    const newRange = this.calculateRangeForZooming.calculateRangeForZooming(
      view.state,
      prevRange.from
    );

    if (!newRange) {
      return;
    }

    this.keepOnlyZoomedContentVisible.keepOnlyZoomedContentVisible(
      view,
      newRange.from,
      newRange.to,
      { scrollIntoView: false }
    );
  }

  public zoomIn(view: EditorView, pos: number) {
    const l = this.logger.bind("ZoomFeature:zoomIn");
    l("zooming in");

    if (!isFoldingEnabled(this.plugin.app)) {
      new Notice(
        `In order to zoom, you must first enable "Fold heading" and "Fold indent" under Settings -> Editor`
      );
      return;
    }

    const range = this.calculateRangeForZooming.calculateRangeForZooming(
      view.state,
      pos
    );

    if (!range) {
      l("unable to calculate range for zooming");
      return;
    }

    this.keepOnlyZoomedContentVisible.keepOnlyZoomedContentVisible(
      view,
      range.from,
      range.to
    );

    for (const cb of this.zoomInCallbacks) {
      cb(view, pos);
    }
  }

  public zoomOut(view: EditorView) {
    const l = this.logger.bind("ZoomFeature:zoomIn");
    l("zooming out");

    this.keepOnlyZoomedContentVisible.showAllContent(view);

    for (const cb of this.zoomOutCallbacks) {
      cb(view);
    }
  }

  async load() {
    this.plugin.registerEditorExtension(
      this.keepOnlyZoomedContentVisible.getExtension()
    );

    this.plugin.addCommand({
      id: "zoom-in",
      name: "Zoom in",
      icon: "zoom-in",
      editorCallback: (editor) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const view: EditorView = (editor as any).cm;
        this.zoomIn(view, view.state.selection.main.head);
      },
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
      icon: "zoom-out",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      editorCallback: (editor) => this.zoomOut((editor as any).cm),
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
