export type TBoundaries = "heading" | "list";

export interface IBoundaries {
  type: TBoundaries;
  startLine: number;
  endLine: number;
}
