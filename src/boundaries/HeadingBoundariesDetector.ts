import { IBoundaries } from "./IBoundaries";

export interface IEditor {
  getLine(n: number): string;
  lastLine(): number;
}

export class HeadingBoundariesDetector {
  constructor(private editor: IEditor, private startLine: number) {}

  detect(): IBoundaries | null {
    const startLevel = this.getHeadingLevel(
      this.editor.getLine(this.startLine)
    );

    if (startLevel < 1) {
      return null;
    }

    let endLine = this.startLine + 1;
    while (endLine <= this.editor.lastLine()) {
      const endLevel = this.getHeadingLevel(this.editor.getLine(endLine));
      if (endLevel > 0 && endLevel <= startLevel) {
        break;
      }
      endLine++;
    }

    return { type: "heading", startLine: this.startLine, endLine };
  }

  private getHeadingLevel(text: string): number {
    const matches = /^(#+) /.exec(text);

    if (!matches) {
      return 0;
    }

    return matches[1].length;
  }
}
