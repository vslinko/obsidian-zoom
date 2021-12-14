import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { isBulletPoint } from "./utils/isBulletPoint";

import { SettingsService } from "../services/SettingsService";

export interface ClickOnBullet {
  clickOnBullet(view: EditorView, pos: number): void;
}

export class DetectClickOnBullet {
  constructor(
    private settings: SettingsService,
    private clickOnBullet: ClickOnBullet
  ) {}

  getExtension() {
    return EditorView.domEventHandlers({
      click: this.detectClickOnBullet,
    });
  }

  public moveCursorToLineEnd(view: EditorView, pos: number) {
    const line = view.state.doc.lineAt(pos);

    view.dispatch({
      selection: EditorSelection.cursor(line.to),
    });
  }

  private detectClickOnBullet = (e: MouseEvent, view: EditorView) => {
    if (
      !this.settings.zoomOnClick ||
      !(e.target instanceof HTMLElement) ||
      !isBulletPoint(e.target)
    ) {
      return;
    }

    const pos = view.posAtDOM(e.target);
    this.clickOnBullet.clickOnBullet(view, pos);
  };
}
