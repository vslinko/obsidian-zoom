import { StateEffect, StateField } from "@codemirror/state";
import { EditorView, showPanel } from "@codemirror/view";

import { renderHeader } from "./utils/renderHeader";

import { LoggerService } from "../services/LoggerService";

export interface Breadcrumb {
  title: string;
  pos: number | null;
}

export interface ZoomIn {
  zoomIn(view: EditorView, pos: number): void;
}

export interface ZoomOut {
  zoomOut(view: EditorView): void;
}

interface HeaderState {
  breadcrumbs: Breadcrumb[];
  onClick: (view: EditorView, pos: number | null) => void;
}

const showHeaderEffect = StateEffect.define<HeaderState>();
const hideHeaderEffect = StateEffect.define<void>();

const headerState = StateField.define<HeaderState | null>({
  create: () => null,
  update: (value, tr) => {
    for (const e of tr.effects) {
      if (e.is(showHeaderEffect)) {
        value = e.value;
      }
      if (e.is(hideHeaderEffect)) {
        value = null;
      }
    }
    return value;
  },
  provide: (f) =>
    showPanel.from(f, (state) => {
      if (!state) {
        return null;
      }

      return (view) => ({
        top: true,
        dom: renderHeader(view.dom.ownerDocument, {
          breadcrumbs: state.breadcrumbs,
          onClick: (pos) => state.onClick(view, pos),
        }),
      });
    }),
});

export class RenderNavigationHeader {
  getExtension() {
    return headerState;
  }

  constructor(
    private logger: LoggerService,
    private zoomIn: ZoomIn,
    private zoomOut: ZoomOut
  ) {}

  public showHeader(view: EditorView, breadcrumbs: Breadcrumb[]) {
    const l = this.logger.bind("ToggleNavigationHeaderLogic:showHeader");
    l("show header");

    view.dispatch({
      effects: [
        showHeaderEffect.of({
          breadcrumbs,
          onClick: this.onClick,
        }),
      ],
    });
  }

  public hideHeader(view: EditorView) {
    const l = this.logger.bind("ToggleNavigationHeaderLogic:hideHeader");
    l("hide header");

    view.dispatch({
      effects: [hideHeaderEffect.of()],
    });
  }

  private onClick = (view: EditorView, pos: number | null) => {
    if (pos === null) {
      this.zoomOut.zoomOut(view);
    } else {
      this.zoomIn.zoomIn(view, pos);
    }
  };
}
