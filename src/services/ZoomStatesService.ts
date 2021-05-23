export class ZoomState {
  constructor(public line: CodeMirror.LineHandle, public header: HTMLElement) {}
}

export class ZoomStatesService {
  private zoomStates: WeakMap<CodeMirror.Editor, ZoomState> = new WeakMap();

  get(editor: CodeMirror.Editor): ZoomState | undefined {
    return this.zoomStates.get(editor);
  }

  has(editor: CodeMirror.Editor): boolean {
    return this.zoomStates.has(editor);
  }

  delete(editor: CodeMirror.Editor) {
    return this.zoomStates.delete(editor);
  }

  set(editor: CodeMirror.Editor, state: ZoomState) {
    return this.zoomStates.set(editor, state);
  }
}
