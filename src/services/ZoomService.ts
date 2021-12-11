import { HeadingBoundariesDetector } from "src/boundaries/HeadingBoundariesDetector";
import { IBoundaries } from "src/boundaries/IBoundaries";
import { ListBoundariesDetector } from "src/boundaries/ListBoundariesDetector";
import { ZoomState, ZoomStatesService } from "src/services/ZoomStatesService";
import { TOCDetector } from "src/toc/TOCDetector";
import { ObsidianService } from "../services/ObsidianService";

export class ZoomService {
  constructor(
    private zoomStatesService: ZoomStatesService,
    private obsidianService: ObsidianService
  ) {}

  zoomOut(editor: CodeMirror.Editor) {
    const zoomState = this.zoomStatesService.get(editor);

    if (!zoomState) {
      return false;
    }

    for (let i = editor.firstLine(), l = editor.lastLine(); i <= l; i++) {
      editor.removeLineClass(i, "wrap", "zoom-plugin-hidden-row");
    }

    zoomState.header.parentElement.removeChild(zoomState.header);

    this.zoomStatesService.delete(editor);

    return true;
  }

  zoomIn(
    editor: CodeMirror.Editor,
    cursor: CodeMirror.Position = editor.getCursor()
  ) {
    const boundaries = this.findBoundaries(editor, cursor.line);

    if (!boundaries) {
      return false;
    }

    this.zoomOut(editor);

    for (let i = editor.firstLine(), l = editor.lastLine(); i <= l; i++) {
      if (i < boundaries.startLine || i >= boundaries.endLine) {
        editor.addLineClass(i, "wrap", "zoom-plugin-hidden-row");
      }
    }

    const toc = new TOCDetector(editor, boundaries.startLine).detect();

    const createSeparator = () => {
      const span = document.createElement("span");
      span.textContent = " > ";
      return span;
    };

    const createTitle = (content: string, cb: () => void) => {
      const a = document.createElement("a");
      a.className = "zoom-plugin-title";
      if (content) {
        a.textContent = content;
      } else {
        a.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }
      a.onclick = (e) => {
        e.preventDefault();
        cb();
      };
      return a;
    };

    const createHeader = () => {
      const div = document.createElement("div");
      div.className = "zoom-plugin-header";

      for (const tocItem of toc.slice(0, -1).reverse()) {
        div.prepend(
          createTitle(tocItem.text, () =>
            this.zoomIn(editor, { line: tocItem.line, ch: 0 })
          )
        );
        div.prepend(createSeparator());
      }

      div.prepend(
        createTitle(this.obsidianService.getActiveLeafDisplayText(), () =>
          this.zoomOut(editor)
        )
      );

      return div;
    };

    const zoomHeader = createHeader();
    editor.getWrapperElement().prepend(zoomHeader);

    this.zoomStatesService.set(
      editor,
      new ZoomState(editor.getLineHandle(boundaries.startLine), zoomHeader)
    );

    return true;
  }

  private findBoundaries(
    editor: CodeMirror.Editor,
    lineNo: number
  ): IBoundaries | null {
    const cache = this.obsidianService.getCacheByEditor(editor);

    if (!cache) {
      return null;
    }

    const headingBoundariesDetector = new HeadingBoundariesDetector(
      cache,
      lineNo
    );
    const headingBoundaries = headingBoundariesDetector.detect();

    if (headingBoundaries) {
      return headingBoundaries;
    }

    const listBoundariesDetector = new ListBoundariesDetector(cache, lineNo);
    return listBoundariesDetector.detect();
  }
}
