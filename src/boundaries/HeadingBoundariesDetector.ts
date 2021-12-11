import { CachedMetadata } from "obsidian";
import { IBoundaries } from "./IBoundaries";

export class HeadingBoundariesDetector {
  constructor(private cache: CachedMetadata, private startLine: number) {}

  detect(): IBoundaries | null {
    if (!this.cache.headings || !this.cache.sections) {
      return null;
    }

    const heading = this.cache.headings
      .filter(
        (h) =>
          h.position.start.line <= this.startLine &&
          h.position.end.line >= this.startLine
      )
      .pop();

    if (!heading) {
      return null;
    }

    const nextHeading = this.cache.headings
      .filter(
        (h) =>
          h.level <= heading.level &&
          h.position.start.line > heading.position.end.line
      )
      .shift();

    const lastSection = this.cache.sections.concat().pop();

    return {
      type: "heading",
      startLine: heading.position.start.line,
      endLine: nextHeading
        ? nextHeading.position.start.line
        : lastSection.position.end.line + 1,
    };
  }
}
