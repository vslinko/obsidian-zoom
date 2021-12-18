export function cleanTitle(title: string) {
  return title
    .trim()
    .replace(/^#+(\s)/, "$1")
    .replace(/^([-+*]|\d+\.)(\s)/, "$2")
    .trim();
}
