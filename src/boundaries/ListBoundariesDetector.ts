import { CachedMetadata } from "obsidian";
import { IBoundaries } from "./IBoundaries";

export class ListBoundariesDetector {
  constructor(private cache: CachedMetadata, private lineNo: number) {}

  detect(): IBoundaries | null {
    if (!this.cache.sections || !this.cache.listItems) {
      return null;
    }

    const list = this.cache.sections
      .filter(
        (s) =>
          s.type === "list" &&
          s.position.start.line <= this.lineNo &&
          s.position.end.line >= this.lineNo
      )
      .shift();

    if (!list) {
      return null;
    }

    const listItems = this.cache.listItems.filter(
      (li) =>
        li.position.start.line >= list.position.start.line &&
        li.position.start.line <= list.position.end.line
    );

    const listItem = listItems
      .filter(
        (li) =>
          li.position.start.line <= this.lineNo &&
          li.position.end.line >= this.lineNo
      )
      .shift();

    const nextListItem = listItems
      .filter(
        (li) =>
          li.position.start.line > listItem.position.end.line &&
          li.parent <= listItem.parent
      )
      .shift();

    console.log(listItem)
    console.log(nextListItem)

    return {
      type: "list",
      startLine: listItem.position.start.line,
      endLine: nextListItem
        ? nextListItem.position.start.line
        : list.position.end.line + 1,
    };
  }
}
