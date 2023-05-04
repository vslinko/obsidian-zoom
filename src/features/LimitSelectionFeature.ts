import { Plugin } from "obsidian";

import { EditorState } from "@codemirror/state";

import { Feature } from "./Feature";

import { LimitSelectionOnZoomingIn } from "../logic/LimitSelectionOnZoomingIn";
import { LimitSelectionWhenZoomedIn } from "../logic/LimitSelectionWhenZoomedIn";
import { LoggerService } from "../services/LoggerService";

export interface CalculateVisibleContentRange {
  calculateVisibleContentRange(
    state: EditorState
  ): { from: number; to: number } | null;
}

export class LimitSelectionFeature implements Feature {
  private limitSelectionOnZoomingIn = new LimitSelectionOnZoomingIn(
    this.logger
  );
  private limitSelectionWhenZoomedIn = new LimitSelectionWhenZoomedIn(
    this.logger,
    this.calculateVisibleContentRange
  );

  constructor(
    private plugin: Plugin,
    private logger: LoggerService,
    private calculateVisibleContentRange: CalculateVisibleContentRange
  ) {}

  async load() {
    this.plugin.registerEditorExtension(
      this.limitSelectionOnZoomingIn.getExtension()
    );

    this.plugin.registerEditorExtension(
      this.limitSelectionWhenZoomedIn.getExtension()
    );
  }

  async unload() {}
}
