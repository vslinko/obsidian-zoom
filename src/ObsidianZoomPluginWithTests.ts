import { editorEditorField } from "obsidian";

import { foldEffect, foldedRanges } from "@codemirror/fold";
import { EditorSelection, StateField } from "@codemirror/state";
import { EditorView, runScopeHandlers } from "@codemirror/view";

import ObsidianZoomPlugin from "./ObsidianZoomPlugin";
import { zoomOutEffect } from "./logic/utils/effects";

const keysMap: { [key: string]: number } = {
  Backspace: 8,
  Enter: 13,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  Delete: 46,
  KeyA: 65,
};

export default class ObsidianZoomPluginWithTests extends ObsidianZoomPlugin {
  private editorView: EditorView;

  wait(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  executeCommandById(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.app as any).commands.executeCommandById(id);
  }

  replaceSelection(char: string) {
    this.editorView.dispatch(this.editorView.state.replaceSelection(char));
  }

  simulateKeydown(keys: string) {
    const e = {
      type: "keydown",
      code: "",
      keyCode: 0,
      shiftKey: false,
      metaKey: false,
      altKey: false,
      ctrlKey: false,
      defaultPrevented: false,
      returnValue: true,
      cancelBubble: false,
      preventDefault: function () {
        e.defaultPrevented = true;
        e.returnValue = true;
      },
      stopPropagation: function () {
        e.cancelBubble = true;
      },
    };

    for (const key of keys.split("-")) {
      switch (key.toLowerCase()) {
        case "cmd":
          e.metaKey = true;
          break;
        case "ctrl":
          e.ctrlKey = true;
          break;
        case "alt":
          e.altKey = true;
          break;
        case "shift":
          e.shiftKey = true;
          break;
        default:
          e.code = key;
          break;
      }
    }

    if (e.code in keysMap) {
      e.keyCode = keysMap[e.code];
    }

    if (e.keyCode == 0) {
      throw new Error("Unknown key: " + e.code);
    }

    runScopeHandlers(this.editorView, e as KeyboardEvent, "editor");
  }

  async load() {
    await super.load();

    if (process.env.TEST_PLATFORM) {
      setImmediate(async () => {
        await this.wait(1000);
        this.connect();
      });
    }
  }

  async prepareForTests() {
    const filePath = `test.md`;
    let file = this.app.vault
      .getMarkdownFiles()
      .find((f) => f.path === filePath);
    if (!file) {
      file = await this.app.vault.create(filePath, "");
    }
    for (let i = 0; i < 10; i++) {
      await this.wait(1000);
      if (this.app.workspace.activeLeaf) {
        this.app.workspace.activeLeaf.openFile(file);
        break;
      }
    }
    await this.wait(1000);

    this.registerEditorExtension(
      StateField.define({
        create: (state) => {
          this.editorView = state.field(editorEditorField);
        },
        update: () => {},
      })
    );
  }

  async connect() {
    await this.prepareForTests();

    const ws = new WebSocket("ws://127.0.0.1:8080/");

    ws.addEventListener("message", (event) => {
      const { id, type, data } = JSON.parse(event.data);

      let result;
      let error;

      try {
        switch (type) {
          case "applyState":
            this.applyState(data);
            break;
          case "simulateKeydown":
            this.simulateKeydown(data);
            break;
          case "replaceSelection":
            this.replaceSelection(data);
            break;
          case "executeCommandById":
            this.executeCommandById(data);
            break;
          case "parseState":
            result = this.parseState(data);
            break;
          case "getCurrentState":
            result = this.getCurrentState();
            break;
        }
      } catch (e) {
        error = String(e);
        if (e.stack) {
          error += "\n" + e.stack;
        }
      }

      ws.send(JSON.stringify({ id, data: result, error }));
    });
  }

  applyState(state: string[]): void;
  applyState(state: string): void;
  applyState(state: IState): void;
  applyState(state: IState | string | string[]) {
    if (typeof state === "string") {
      state = state.split("\n");
    }

    if (Array.isArray(state)) {
      state = this.parseState(state);
    }

    this.editorView.dispatch({
      effects: [zoomOutEffect.of()],
    });
    this.editorView.dispatch({
      changes: [{ from: 0, to: this.editorView.state.doc.length, insert: "" }],
    });
    this.editorView.dispatch({
      changes: [{ from: 0, insert: state.value }],
    });
    this.editorView.dispatch({
      selection: EditorSelection.create(
        state.selections.map((s) => EditorSelection.range(s.anchor, s.head))
      ),
    });
    this.editorView.dispatch({
      effects: state.folds.map((f) =>
        foldEffect.of({ from: f.from, to: f.to })
      ),
    });
  }

  getCurrentState(): IState {
    const hidden: number[] = [];

    const hiddenRanges = this.zoomFeature.calculateHiddenContentRanges(
      this.editorView.state
    );
    for (const i of hiddenRanges) {
      const lineFrom = this.editorView.state.doc.lineAt(i.from).number - 1;
      const lineTo = this.editorView.state.doc.lineAt(i.to).number - 1;
      for (let lineNo = lineFrom; lineNo <= lineTo; lineNo++) {
        hidden.push(lineNo);
      }
    }

    const folds: IFold[] = [];
    const iter = foldedRanges(this.editorView.state).iter();
    while (iter.value !== null) {
      folds.push({ from: iter.from, to: iter.to });
      iter.next();
    }

    return {
      hidden,
      folds,
      selections: this.editorView.state.selection.ranges.map((r) => ({
        anchor: r.anchor,
        head: r.head,
      })),
      value: this.editorView.state.doc.sliceString(0),
    };
  }

  parseState(content: string[]): IState;
  parseState(content: string): IState;
  parseState(content: string | string[]): IState {
    if (typeof content === "string") {
      content = content.split("\n");
    }

    const acc = content.reduce(
      (acc, line, lineNo) => {
        if (acc.foldFrom === null) {
          const arrowIndex = line.indexOf(">");
          if (arrowIndex >= 0) {
            acc.foldFrom = acc.chars + arrowIndex;
            line =
              line.substring(0, arrowIndex) + line.substring(arrowIndex + 1);
          }
        } else {
          const arrowIndex = line.indexOf("<");
          if (arrowIndex >= 0) {
            acc.folds.push({ from: acc.foldFrom, to: acc.chars + arrowIndex });
            acc.foldFrom = null;
            line =
              line.substring(0, arrowIndex) + line.substring(arrowIndex + 1);
          }
        }

        if (line.includes("#hidden")) {
          line = line.replace("#hidden", "").trim();
          acc.hidden.push(lineNo);
        }

        if (acc.anchor === null) {
          const dashIndex = line.indexOf("|");
          if (dashIndex >= 0) {
            acc.anchor = acc.chars + dashIndex;
            line = line.substring(0, dashIndex) + line.substring(dashIndex + 1);
          }
        }

        if (acc.head === null) {
          const dashIndex = line.indexOf("|");
          if (dashIndex >= 0) {
            acc.head = acc.chars + dashIndex;
            line = line.substring(0, dashIndex) + line.substring(dashIndex + 1);
          }
        }

        acc.chars += line.length;
        acc.chars += 1;
        acc.lines.push(line);

        return acc;
      },
      {
        lines: [] as string[],
        chars: 0,
        anchor: null as number | null,
        head: null as number | null,
        foldFrom: null as number | null,
        folds: [] as IFold[],
        hidden: [] as number[],
      }
    );
    if (acc.anchor === null) {
      acc.anchor = 0;
    }
    if (acc.head === null) {
      acc.head = acc.anchor;
    }

    return {
      hidden: acc.hidden,
      folds: acc.folds,
      selections: [{ anchor: acc.anchor, head: acc.head }],
      value: acc.lines.join("\n"),
    };
  }
}
