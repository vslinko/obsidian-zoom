import { ListBoundariesDetector } from "../boundaries/ListBoundariesDetector";

export interface IEditor {
  getLine(n: number): string;
  firstLine(): number;
  lastLine(): number;
}

export interface ITOCItem {
  line: number;
  text: string;
}

class ListTOCDetector {
  constructor(private editor: IEditor, private lineNo: number) {}

  detect(): ITOCItem[] {
    const b = new ListBoundariesDetector(this.editor, this.lineNo).detect();

    if (!b) {
      return [];
    }

    const m = this.parseLine(this.editor.getLine(b.startLine));

    if (!m) {
      return [];
    }

    const res: ITOCItem[] = [{ line: b.startLine, text: m.content }];
    let currentIndent = m.indent;
    let l = b.startLine - 1;

    while (l >= this.editor.firstLine() && currentIndent.length > 0) {
      const m = this.parseLine(this.editor.getLine(l));

      if (
        m &&
        m.indent.length === 0 &&
        m.bullet.length === 0 &&
        m.content.length > 0
      ) {
        break;
      }

      if (
        m &&
        m.bullet.length > 0 &&
        currentIndent.startsWith(m.indent) &&
        currentIndent.length !== m.indent.length
      ) {
        currentIndent = m.indent;
        res.unshift({
          line: l,
          text: m.content,
        });
      }

      l--;
    }

    if (currentIndent.length > 0) {
      return [];
    }

    return res;
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

class HeadingTOCDetector {
  constructor(private editor: IEditor, private lineNo: number) {}

  detect(): ITOCItem[] {
    let currentLevel: number | null = null;

    const res: ITOCItem[] = [];
    let l = this.lineNo;
    while (l >= this.editor.firstLine()) {
      const line = this.editor.getLine(l);
      const level = this.getHeadingLevel(line);

      const firstMeetHeading = level > 0 && currentLevel === null;
      const lowerHeading =
        level > 0 && currentLevel !== null && level < currentLevel;

      if (firstMeetHeading || lowerHeading) {
        currentLevel = level;
        res.unshift({
          line: l,
          text: line.slice(level + 1),
        });
      }

      if (currentLevel !== null && currentLevel <= 1) {
        break;
      }

      l--;
    }

    return res;
  }

  private getHeadingLevel(text: string): number {
    const matches = /^(#+) /.exec(text);

    if (!matches) {
      return 0;
    }

    return matches[1].length;
  }
}

export class TOCDetector {
  constructor(private editor: IEditor, private lineNo: number) {}

  detect(): ITOCItem[] {
    const listToc = new ListTOCDetector(this.editor, this.lineNo).detect();
    const headingToc = new HeadingTOCDetector(
      this.editor,
      listToc.length > 0 ? listToc[0].line : this.lineNo
    ).detect();

    return headingToc.concat(listToc);
  }
}
