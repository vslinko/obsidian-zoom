import { IBoundaries } from "./IBoundaries";

export interface IEditor {
  getLine(n: number): string;
  firstLine(): number;
  lastLine(): number;
}

export class ListBoundariesDetector {
  constructor(private editor: IEditor, private lineNo: number) {}

  detect(): IBoundaries | null {
    let startLine = this.lineNo;

    let foundIndent: string | null = null;
    let startIndent: string | null = null;

    while (startLine >= this.editor.firstLine()) {
      const matches = this.parseLine(this.editor.getLine(startLine));

      if (!matches) {
        return null;
      }

      const { indent, bullet, content } = matches;

      if (indent.length === 0 && bullet.length === 0 && content.length > 0) {
        return null;
      }

      if (foundIndent === null && indent.length > 0) {
        foundIndent = indent;
      }

      if (bullet.length > 0 && foundIndent === null) {
        startIndent = indent;
        break;
      }

      if (
        bullet.length > 0 &&
        foundIndent !== null &&
        foundIndent.length >= indent.length
      ) {
        startIndent = indent;
        break;
      }

      startLine--;
    }

    if (startLine < this.editor.firstLine()) {
      return null;
    }

    let endLine = startLine + 1;
    while (endLine <= this.editor.lastLine()) {
      const matches = this.parseLine(this.editor.getLine(endLine));

      if (!matches) {
        return null;
      }

      const { indent, bullet, content } = matches;

      if (indent.length === 0 && bullet.length === 0 && content.length === 0) {
        endLine++;
        continue;
      }

      if (indent.length <= startIndent.length) {
        break;
      }

      endLine++;
    }

    return { type: "list", startLine, endLine };
  }

  private parseLine(text: string) {
    const matches = /^([ \t]*)([-+*] )?(.*)$/.exec(text);

    if (!matches) {
      return null;
    }

    const indent = matches[1];
    const bullet = matches[2] ? matches[2].slice(0, 1) : "";
    const content = matches[3];

    return {
      indent,
      bullet,
      content,
    };
  }
}
