export function cleanTitle(title: string) {
  return title
    .trim()
    .replace(/^#+/, "")
    .replace(/^([-+*]|\d+\.)/, "")
    .trim();
}
