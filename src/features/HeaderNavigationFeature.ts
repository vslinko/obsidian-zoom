import { Plugin } from "obsidian";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { Feature } from "./Feature";
import { getDocumentTitle } from "./utils/getDocumentTitle";
import { getEditorViewFromEditorState } from "./utils/getEditorViewFromEditorState";

import { CollectBreadcrumbs } from "../logic/CollectBreadcrumbs";
import { DetectRangeBeforeVisibleRangeChanged } from "../logic/DetectRangeBeforeVisibleRangeChanged";
import { RenderNavigationHeader } from "../logic/RenderNavigationHeader";
import { LoggerService } from "../services/LoggerService";

export interface ZoomIn {
  zoomIn(view: EditorView, pos: number): void;
}

export interface ZoomOut {
  zoomOut(view: EditorView): void;
}

export interface NotifyAfterZoomIn {
  notifyAfterZoomIn(cb: (view: EditorView, pos: number) => void): void;
}

export interface NotifyAfterZoomOut {
  notifyAfterZoomOut(cb: (view: EditorView) => void): void;
}

export interface CalculateHiddenContentRanges {
  calculateHiddenContentRanges(
    state: EditorState
  ): { from: number; to: number }[] | null;
}

export interface CalculateVisibleContentRange {
  calculateVisibleContentRange(
    state: EditorState
  ): { from: number; to: number } | null;
}

class ShowHeaderAfterZoomIn implements Feature {
  constructor(
    private notifyAfterZoomIn: NotifyAfterZoomIn,
    private collectBreadcrumbs: CollectBreadcrumbs,
    private renderNavigationHeader: RenderNavigationHeader
  ) {}

  async load() {
    this.notifyAfterZoomIn.notifyAfterZoomIn((view, pos) => {
      const breadcrumbs = this.collectBreadcrumbs.collectBreadcrumbs(
        view.state,
        pos
      );
      this.renderNavigationHeader.showHeader(view, breadcrumbs);
    });
  }

  async unload() {}
}

class HideHeaderAfterZoomOut implements Feature {
  constructor(
    private notifyAfterZoomOut: NotifyAfterZoomOut,
    private renderNavigationHeader: RenderNavigationHeader
  ) {}

  async load() {
    this.notifyAfterZoomOut.notifyAfterZoomOut((view) => {
      this.renderNavigationHeader.hideHeader(view);
    });
  }

  async unload() {}
}

class UpdateHeaderAfterRangeBeforeVisibleRangeChanged implements Feature {
  private detectRangeBeforeVisibleRangeChanged =
    new DetectRangeBeforeVisibleRangeChanged(
      this.calculateHiddenContentRanges,
      {
        rangeBeforeVisibleRangeChanged: (state) =>
          this.rangeBeforeVisibleRangeChanged(state),
      }
    );

  constructor(
    private plugin: Plugin,
    private calculateHiddenContentRanges: CalculateHiddenContentRanges,
    private calculateVisibleContentRange: CalculateVisibleContentRange,
    private collectBreadcrumbs: CollectBreadcrumbs,
    private renderNavigationHeader: RenderNavigationHeader
  ) {}

  async load() {
    this.plugin.registerEditorExtension(
      this.detectRangeBeforeVisibleRangeChanged.getExtension()
    );
  }

  async unload() {}

  private rangeBeforeVisibleRangeChanged(state: EditorState) {
    const view = getEditorViewFromEditorState(state);

    const pos =
      this.calculateVisibleContentRange.calculateVisibleContentRange(
        state
      ).from;

    const breadcrumbs = this.collectBreadcrumbs.collectBreadcrumbs(state, pos);

    this.renderNavigationHeader.showHeader(view, breadcrumbs);
  }
}

export class HeaderNavigationFeature implements Feature {
  private collectBreadcrumbs = new CollectBreadcrumbs({
    getDocumentTitle: getDocumentTitle,
  });

  private renderNavigationHeader = new RenderNavigationHeader(
    this.logger,
    this.zoomIn,
    this.zoomOut
  );

  private showHeaderAfterZoomIn = new ShowHeaderAfterZoomIn(
    this.notifyAfterZoomIn,
    this.collectBreadcrumbs,
    this.renderNavigationHeader
  );

  private hideHeaderAfterZoomOut = new HideHeaderAfterZoomOut(
    this.notifyAfterZoomOut,
    this.renderNavigationHeader
  );

  private updateHeaderAfterRangeBeforeVisibleRangeChanged =
    new UpdateHeaderAfterRangeBeforeVisibleRangeChanged(
      this.plugin,
      this.calculateHiddenContentRanges,
      this.calculateVisibleContentRange,
      this.collectBreadcrumbs,
      this.renderNavigationHeader
    );

  constructor(
    private plugin: Plugin,
    private logger: LoggerService,
    private calculateHiddenContentRanges: CalculateHiddenContentRanges,
    private calculateVisibleContentRange: CalculateVisibleContentRange,
    private zoomIn: ZoomIn,
    private zoomOut: ZoomOut,
    private notifyAfterZoomIn: NotifyAfterZoomIn,
    private notifyAfterZoomOut: NotifyAfterZoomOut
  ) {}

  async load() {
    this.plugin.registerEditorExtension(
      this.renderNavigationHeader.getExtension()
    );

    this.showHeaderAfterZoomIn.load();
    this.hideHeaderAfterZoomOut.load();
    this.updateHeaderAfterRangeBeforeVisibleRangeChanged.load();
  }

  async unload() {
    this.showHeaderAfterZoomIn.unload();
    this.hideHeaderAfterZoomOut.unload();
    this.updateHeaderAfterRangeBeforeVisibleRangeChanged.unload();
  }
}
