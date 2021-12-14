import { StateEffect } from "@codemirror/state";

export interface ZoomInRange {
  from: number;
  to: number;
}

export type ZoomInStateEffect = StateEffect<ZoomInRange>;

export const zoomInEffect = StateEffect.define<ZoomInRange>();

export const zoomOutEffect = StateEffect.define<void>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isZoomInEffect(e: StateEffect<any>): e is ZoomInStateEffect {
  return e.is(zoomInEffect);
}
