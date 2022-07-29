import { App } from "obsidian";

export function isFoldingEnabled(app: App) {
  const config: {
    foldHeading: boolean;
    foldIndent: boolean;
  } = {
    foldHeading: true,
    foldIndent: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(app.vault as any).config,
  };

  return config.foldHeading && config.foldIndent;
}
