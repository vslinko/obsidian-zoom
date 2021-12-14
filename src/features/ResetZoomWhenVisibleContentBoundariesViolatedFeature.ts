import { Plugin_2 } from "obsidian";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { Feature } from "./Feature";
import { getEditorViewFromEditorState } from "./utils/getEditorViewFromEditorState";

import { DetectVisibleContentBoundariesViolation } from "../logic/DetectVisibleContentBoundariesViolation";

export interface CalculateHiddenContentRanges {
  calculateHiddenContentRanges(
    state: EditorState
  ): { from: number; to: number }[] | null;
}

export interface ZoomOut {
  zoomOut(view: EditorView): void;
}

export class ResetZoomWhenVisibleContentBoundariesViolatedFeature
  implements Feature
{
  private detectVisibleContentBoundariesViolation =
    new DetectVisibleContentBoundariesViolation(
      this.calculateHiddenContentRanges,
      {
        visibleContentBoundariesViolated: (state) =>
          this.visibleContentBoundariesViolated(state),
      }
    );

  constructor(
    private plugin: Plugin_2,
    private calculateHiddenContentRanges: CalculateHiddenContentRanges,
    private zoomOut: ZoomOut
  ) {}

  async load() {
    this.plugin.registerEditorExtension(
      this.detectVisibleContentBoundariesViolation.getExtension()
    );
  }

  async unload() {}

  private visibleContentBoundariesViolated(state: EditorState) {
    this.zoomOut.zoomOut(getEditorViewFromEditorState(state));
  }
}
