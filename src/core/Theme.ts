import type Pea from "./Pea";

interface ThemeOptions {
  modules: Record<string, unknown>;
  docStyles: Record<string, string>;
}

class Theme {
  static DEFAULTS: ThemeOptions = {
    modules: {},
    docStyles: {},
  };

  pea: Pea;
  options: ThemeOptions;

  constructor(pea: Pea, options: ThemeOptions) {
    this.pea = pea;
    this.options = options;
  }

  init(): void {
    for (const style in this.options.docStyles)
      this.pea.root.style.setProperty(style, this.options.docStyles[style]);
  }
}

export { Theme as default };
export type { ThemeOptions };
