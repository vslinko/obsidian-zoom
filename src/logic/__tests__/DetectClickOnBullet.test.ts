/**
 * @jest-environment jsdom
 */
import { EditorState } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";

import { DetectClickOnBullet } from "../DetectClickOnBullet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const settings: any = { zoomOnClick: true };
const clickOnBullet = { clickOnBullet: jest.fn() };
const detectClickOnBullet = new DetectClickOnBullet(settings, clickOnBullet);
const decs = Decoration.set([
  Decoration.mark({ class: "list-bullet" }).range(0, 1),
  Decoration.mark({ class: "cm-formatting-list" }).range(6, 7),
  Decoration.mark({ class: "other" }).range(8, 9),
]);
const view = new EditorView({
  state: EditorState.create({
    doc: "- 1\n  - 2",
    extensions: [
      detectClickOnBullet.getExtension(),
      EditorView.decorations.of(decs),
    ],
  }),
  parent: document.body,
});

test("should detect click on span.list-bullet", () => {
  view.dom.querySelector<HTMLSpanElement>(".list-bullet").click();

  expect(clickOnBullet.clickOnBullet).toBeCalled();
});

test("should detect click on span.cm-formatting-list", () => {
  view.dom.querySelector<HTMLSpanElement>(".cm-formatting-list").click();

  expect(clickOnBullet.clickOnBullet).toBeCalled();
});

test("should not detect click on other elements", () => {
  view.dom.querySelector<HTMLSpanElement>(".other").click();

  expect(clickOnBullet.clickOnBullet).not.toBeCalled();
});
