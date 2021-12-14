export function isBulletPoint(e: HTMLElement) {
  return (
    e instanceof HTMLSpanElement &&
    (e.classList.contains("list-bullet") ||
      e.classList.contains("cm-formatting-list"))
  );
}
