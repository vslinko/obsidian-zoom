import { EditorState, Extension, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

import { zoomInEffect, zoomOutEffect } from "./utils/effects";
import { rangeSetToArray } from "./utils/rangeSetToArray";

import { LoggerService } from "../services/LoggerService";

const zoomMarkHidden = Decoration.replace({ block: true });

const zoomStateField = StateField.define<DecorationSet>({
  create: () => {
    return Decoration.none;
  },

  update: (value, tr) => {
    value = value.map(tr.changes);

    for (const e of tr.effects) {
      if (e.is(zoomInEffect)) {
        value = value.update({ filter: () => false });

        if (e.value.from > 0) {
          value = value.update({
            add: [zoomMarkHidden.range(0, e.value.from - 1)],
          });
        }

        if (e.value.to < tr.newDoc.length) {
          value = value.update({
            add: [zoomMarkHidden.range(e.value.to + 1, tr.newDoc.length)],
          });
        }
      }

      if (e.is(zoomOutEffect)) {
        value = value.update({ filter: () => false });
      }
    }

    return value;
  },

  provide: (zoomStateField) => EditorView.decorations.from(zoomStateField),
});

export class KeepOnlyZoomedContentVisible {
  constructor(private logger: LoggerService) {}

  public getExtension(): Extension {
    return zoomStateField;
  }

  public calculateHiddenContentRanges(state: EditorState) {
    return rangeSetToArray(state.field(zoomStateField));
  }

  public calculateVisibleContentRange(state: EditorState) {
    const hidden = this.calculateHiddenContentRanges(state);

    if (hidden.length === 1) {
      const [a] = hidden;

      if (a.from === 0) {
        return { from: a.to + 1, to: state.doc.length };
      } else {
        return { from: 0, to: a.from - 1 };
      }
    }

    if (hidden.length === 2) {
      const [a, b] = hidden;

      return { from: a.to + 1, to: b.from - 1 };
    }

    return null;
  }

  public keepOnlyZoomedContentVisible(
    view: EditorView,
    from: number,
    to: number
  ) {
    const effect = zoomInEffect.of({ from, to });

    this.logger.log(
      "KeepOnlyZoomedContent:keepOnlyZoomedContentVisible",
      "keep only zoomed content visible",
      effect.value.from,
      effect.value.to
    );

    view.dispatch({
      effects: [effect],
    });
    view.dispatch({
      effects: [
        EditorView.scrollIntoView(view.state.selection.main, {
          y: "start",
        }),
      ],
    });
  }

  public showAllContent(view: EditorView) {
    this.logger.log("KeepOnlyZoomedContent:showAllContent", "show all content");

    view.dispatch({ effects: [zoomOutEffect.of()] });
    view.dispatch({
      effects: [
        EditorView.scrollIntoView(view.state.selection.main, {
          y: "center",
        }),
      ],
    });
  }
}
